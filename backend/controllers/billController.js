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

async function createBill(req, res) {
  try {
    console.log('Creating bill with data:', req.body);
    
    // Generate a unique bill_id by finding the max bill_id and adding 1
    const maxBill = await prisma.bill.findFirst({
      orderBy: { bill_id: 'desc' },
      select: { bill_id: true }
    });
    
    const newBillId = maxBill ? maxBill.bill_id + 1 : 1;
    
    // Map frontend data to database schema
    // Frontend sends: { address_id, bill_type, amount, due_date, status }
    // Database expects: { bill_id, address_id, utility_id, units, amount, due_date, status }
    const { bill_type, ...restData } = req.body;
    
    let utility_id = null;
    
    // If bill_type is provided, find or create the utility
    if (bill_type) {
      // Try to find existing utility with this type
      let utility = await prisma.utility.findFirst({
        where: { type: bill_type }
      });
      
      // If not found, create a new utility
      if (!utility) {
        // Find max utility_id to generate new one
        const maxUtility = await prisma.utility.findFirst({
          orderBy: { utility_id: 'desc' },
          select: { utility_id: true }
        });
        const newUtilityId = maxUtility ? maxUtility.utility_id + 1 : 1;
        
        utility = await prisma.utility.create({
          data: {
            utility_id: newUtilityId,
            type: bill_type,
            charge_per_unit: null,
            dept_id: null
          }
        });
        console.log('Created new utility:', utility);
      }
      
      utility_id = utility.utility_id;
    }
    
    const billData = {
      bill_id: newBillId,
      utility_id: utility_id,
      units: null,
      ...restData
    };
    
    const bill = await prisma.bill.create({ 
      data: billData
    });
    
    console.log('Bill created successfully:', bill);
    return res.status(201).json(bill);
  } catch (error) {
    console.error('Error creating bill:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function updateBill(req, res) {
  try {
    console.log('Updating bill ID:', req.params.id, 'with data:', req.body);
    
    // Map frontend data to database schema (same as create)
    const { bill_type, ...restData } = req.body;
    
    let utility_id = null;
    
    // If bill_type is provided, find or create the utility
    if (bill_type) {
      // Try to find existing utility with this type
      let utility = await prisma.utility.findFirst({
        where: { type: bill_type }
      });
      
      // If not found, create a new utility
      if (!utility) {
        // Find max utility_id to generate new one
        const maxUtility = await prisma.utility.findFirst({
          orderBy: { utility_id: 'desc' },
          select: { utility_id: true }
        });
        const newUtilityId = maxUtility ? maxUtility.utility_id + 1 : 1;
        
        utility = await prisma.utility.create({
          data: {
            utility_id: newUtilityId,
            type: bill_type,
            charge_per_unit: null,
            dept_id: null
          }
        });
        console.log('Created new utility:', utility);
      }
      
      utility_id = utility.utility_id;
    }
    
    const billData = {
      utility_id: utility_id,
      units: null,
      ...restData
    };
    
    console.log('Transformed data for database:', billData);
    
    const bill = await prisma.bill.update({
      where: { bill_id: parseInt(req.params.id) },
      data: billData
    });
    
    console.log('Bill updated successfully:', bill);
    return res.json(bill);
  } catch (error) {
    console.error('Error updating bill:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function deleteBill(req, res) {
  try {
    console.log('Deleting bill ID:', req.params.id);
    
    await prisma.bill.delete({
      where: { bill_id: parseInt(req.params.id) },
    });
    
    console.log('Bill deleted successfully');
    return res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  viewBill,
  createBill,
  updateBill,
  deleteBill
};
