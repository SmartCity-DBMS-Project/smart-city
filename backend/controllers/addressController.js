const prisma = require('../lib/prisma');

async function handleGetAddressesByBuilding(req, res) {
  try{
    console.log(`handleGetAddressesByBuilding`);

    const building_id = parseInt(req.params.building_id);

    const addressData = await prisma.address.findMany({
      where: {
        building_id: building_id,
      },
      select: {
        address_id: true,
        street: true,
        zone: true,
        flat_no: true,
        city: true,
        pincode: true,
      },
    });

    return res.status(200).json(addressData);
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}

async function handleAddAddressToBuilding(req, res) {
  try{
    console.log(`handleAddAddressToBuilding`);
    return res.status(200).json({message: "Success"});
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}

async function handleUpdateAddress(req, res) {
  try{
    console.log(`handleUpdateAddress`);
    return res.status(200).json({message: "Success"});
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}

async function handleDeleteAddress(req, res) {
  try{
    console.log(`handleDeleteAddress`);
    return res.status(200).json({message: "Success"});
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}

module.exports = {
    handleGetAddressesByBuilding,
    handleAddAddressToBuilding,
    handleUpdateAddress,
    handleDeleteAddress,
}