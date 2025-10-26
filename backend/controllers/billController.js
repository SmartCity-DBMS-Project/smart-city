const prisma = require('../lib/prisma');

async function viewBill(req, res) {
  try {
    if (req.user.role === 'ADMIN') {
      // Admin can view all bills
      const bills = await prisma.bill.findMany();
      return res.json(bills);
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
        }
      });
      return res.json(bills);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function createBill(req, res) {
  try {
    console.log('Creating bill with data:', req.body);
    
    const bill = await prisma.bill.create({ data: req.body });
    
    console.log('Bill created successfully:', bill);
    return res.status(201).json(bill);
  } catch (error) {
    console.error('Error creating bill:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function updateBill(req, res) {
  try {
    const bill = await prisma.bill.update({
      where: { bill_id: parseInt(req.params.id) },
      data: req.body
    });
    return res.json(bill);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function deleteBill(req, res) {
  try {
    await prisma.bill.delete({
      where: { bill_id: parseInt(req.params.id) },
    });
    return res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  viewBill,
  createBill,
  updateBill,
  deleteBill
};
