const prisma = require('../lib/prisma');

async function viewBill(req, res) {
  try {
    if (req.user.role === 'ADMIN') {
      // Admin can view all bills
      const bills = await prisma.bill.findMany({
        include: {
          utility: true  // Include utility info to get type
        }
      });
      // Map to include bill_type for frontend compatibility
      const mappedBills = bills.map(bill => ({
        ...bill,
        bill_type: bill.utility?.type || 'N/A'
      }));
      return res.json(mappedBills);
    } else {
      // Non-admin users can only view their own bills
      // First, get the citizen_id from the login table using email
      const loginInfo = await prisma.login.findUnique({
        where: { email: req.user.email },
        select: { citizen_id: true }
      });

      if (!loginInfo || !loginInfo.citizen_id) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get all addresses associated with this citizen
      const citizenAddresses = await prisma.citizen_address.findMany({
        where: { citizen_id: loginInfo.citizen_id },
        select: { address_id: true }
      });

      // Extract address IDs
      const addressIds = citizenAddresses.map(ca => ca.address_id);

      if (addressIds.length === 0) {
        return res.json([]); // No addresses, no bills
      }

      // Fetch bills for those addresses
      const bills = await prisma.bill.findMany({
        where: {
          address_id: {
            in: addressIds
          }
        },
        include: {
          utility: true  // Include utility info to get type
        }
      });
      // Map to include bill_type for frontend compatibility
      const mappedBills = bills.map(bill => ({
        ...bill,
        bill_type: bill.utility?.type || 'N/A'
      }));
      return res.json(mappedBills);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Function to get utility types for dropdown
async function getUtilityTypes(req, res) {
  try {
    const utilities = await prisma.utility.findMany({
      select: {
        utility_id: true,
        type: true
      }
    });
    
    return res.json(utilities);
  } catch (error) {
    console.error('Error fetching utility types:', error);
    return res.status(500).json({ error: 'Failed to fetch utility types' });
  }
}

// Function to get addresses for dropdown
async function getAddressList(req, res) {
  try {
    const addresses = await prisma.address.findMany({
      include: {
        building: {
          select: {
            building_name: true
          }
        }
      }
    });
    
    // Format the addresses for the dropdown
    const formattedAddresses = addresses.map(addr => ({
      address_id: addr.address_id,
      display_name: `${addr.building?.building_name || 'Unknown Building'} - ${addr.flat_no || 'No Flat'}`
    }));
    
    return res.json(formattedAddresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return res.status(500).json({ error: 'Failed to fetch addresses' });
  }
}

async function createBill(req, res) {
  try {
    console.log('Creating bill with data:', req.body);
    
    // Validate required fields
    const { address_id, bill_type, units, due_date, status } = req.body;
    
    if (!address_id) {
      return res.status(400).json({ error: "Address ID is required" });
    }
    
    if (!bill_type) {
      return res.status(400).json({ error: "Bill type is required" });
    }
    
    if (!units || isNaN(parseFloat(units)) || parseFloat(units) <= 0) {
      return res.status(400).json({ error: "Units must be a positive number" });
    }
    
    if (!due_date) {
      return res.status(400).json({ error: "Due date is required" });
    }
    
    // Map frontend data to database schema
    // Frontend sends: { address_id, bill_type, units, due_date, status }
    // Database expects: { bill_id, address_id, utility_id, units, amount, due_date, status }
    const { bill_type: billType, ...restData } = req.body;
    
    let utility_id = null;
    let charge_per_unit = null;
    
    // If bill_type is provided, find or create the utility
    if (billType) {
      // Try to find existing utility with this type
      let utility = await prisma.utility.findFirst({
        where: { type: billType }
      });
      
      // If not found, create a new utility
      if (!utility) {
        // Let's first check if a utility with this type already exists (case insensitive)
        utility = await prisma.utility.findFirst({
          where: { 
            type: {
              equals: billType,
              mode: 'insensitive'
            }
          }
        });
        
        // If still not found, create a new utility
        if (!utility) {
          utility = await prisma.utility.create({
            data: {
              type: billType,
              charge_per_unit: null,
              dept_id: null
            }
          });
          console.log('Created new utility:', utility);
        }
      }
      
      utility_id = utility.utility_id;
      charge_per_unit = utility.charge_per_unit;
    }
    
    // Calculate amount based on units and charge_per_unit
    let amount = 0;
    if (charge_per_unit) {
      amount = parseFloat(units) * parseFloat(charge_per_unit);
    }
    
    // Handle date parsing
    let parsedDueDate;
    try {
      parsedDueDate = new Date(due_date);
      if (isNaN(parsedDueDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (dateError) {
      return res.status(400).json({ error: "Invalid due date format. Please use YYYY-MM-DD format." });
    }
    
    const billData = {
      utility_id: utility_id,
      units: parseFloat(units),
      amount: amount,
      due_date: parsedDueDate,
      ...restData
    };
    
    // Validate that address_id exists before creating bill
    if (billData.address_id) {
      const addressExists = await prisma.address.findUnique({
        where: { address_id: parseInt(billData.address_id) }
      });
      
      if (!addressExists) {
        return res.status(400).json({ error: `Address with ID ${billData.address_id} does not exist` });
      }
    }
    
    const bill = await prisma.bill.create({ 
      data: billData
    });
    
    console.log('Bill created successfully:', bill);
    return res.status(201).json(bill);
  } catch (error) {
    console.error('Error creating bill:', error);
    // Provide more specific error messages for foreign key violations
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Foreign key constraint failed. Please check that the address_id exists.' });
    }
    return res.status(500).json({ error: error.message });
  }
}

async function updateBill(req, res) {
  try {
    console.log('Updating bill ID:', req.params.id, 'with data:', req.body);
    
    // Validate required fields
    const { address_id, bill_type, units, due_date, status } = req.body;
    
    if (!address_id) {
      return res.status(400).json({ error: "Address ID is required" });
    }
    
    if (!bill_type) {
      return res.status(400).json({ error: "Bill type is required" });
    }
    
    if (!units || isNaN(parseFloat(units)) || parseFloat(units) <= 0) {
      return res.status(400).json({ error: "Units must be a positive number" });
    }
    
    if (!due_date) {
      return res.status(400).json({ error: "Due date is required" });
    }
    
    // Map frontend data to database schema (same as create)
    const { bill_type: billType, ...restData } = req.body;
    
    let utility_id = null;
    let charge_per_unit = null;
    
    // If bill_type is provided, find or create the utility
    if (billType) {
      // Try to find existing utility with this type
      let utility = await prisma.utility.findFirst({
        where: { type: billType }
      });
      
      // If not found, create a new utility
      if (!utility) {
        utility = await prisma.utility.create({
          data: {
            type: billType,
            charge_per_unit: null,
            dept_id: null
          }
        });
        console.log('Created new utility:', utility);
      }
      
      utility_id = utility.utility_id;
      charge_per_unit = utility.charge_per_unit;
    }
    
    // Calculate amount based on units and charge_per_unit
    let amount = 0;
    if (charge_per_unit) {
      amount = parseFloat(units) * parseFloat(charge_per_unit);
    }
    
    const billData = {
      utility_id: utility_id,
      units: parseFloat(units),
      amount: amount,
      due_date: new Date(due_date),
      ...restData
    };
    
    // Validate that address_id exists before updating bill
    if (billData.address_id) {
      const addressExists = await prisma.address.findUnique({
        where: { address_id: parseInt(billData.address_id) }
      });
      
      if (!addressExists) {
        return res.status(400).json({ error: `Address with ID ${billData.address_id} does not exist` });
      }
    }
    
    console.log('Transformed data for database:', billData);
    
    const bill = await prisma.bill.update({
      where: { bill_id: parseInt(req.params.id) },
      data: billData
    });
    
    console.log('Bill updated successfully:', bill);
    return res.json(bill);
  } catch (error) {
    console.error('Error updating bill:', error);
    // Provide more specific error messages for foreign key violations
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Foreign key constraint failed. Please check that the address_id exists.' });
    }
    return res.status(500).json({ error: error.message });
  }
}

async function deleteBill(req, res) {
  try {
    const billId = parseInt(req.params.id);
    
    // Check if bill exists
    const existingBill = await prisma.bill.findUnique({
      where: { bill_id: billId }
    });
    
    if (!existingBill) {
      return res.status(404).json({ error: "Bill not found" });
    }
    
    // Delete the bill
    await prisma.bill.delete({
      where: { bill_id: billId }
    });
    
    return res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error('Error deleting bill:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  viewBill,
  getUtilityTypes,
  getAddressList,
  createBill,
  updateBill,
  deleteBill
};