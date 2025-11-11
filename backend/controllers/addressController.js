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
        flat_no: true,
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
    const building_id = parseInt(req.params.building_id);

    const new_address = await prisma.address.create({
        data:{
            building_id: building_id,
            flat_no: req.body.flat_no,
        }
    })
    return res.status(200).json(new_address);
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}

async function handleUpdateAddress(req, res) {
  try{
    console.log(`handleUpdateAddress`);
    const building_id = parseInt(req.params.building_id);
    const address_id = parseInt(req.params.address_id);

    const adds = await prisma.address.findUnique({
        where: {
            address_id: address_id,
        },
    });

    let new_address;

    if(!adds){
        new_address = await prisma.address.create({
        data:{
            building_id: building_id,
            flat_no: req.body.flat_no,
        }
    })
    }
    else{
        new_address = await prisma.address.update({
            where: {
                address_id: address_id,
            },
            data: {
                flat_no: req.body.flat_no,
            }
        })
    }
    return res.status(200).json(new_address);
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}

async function handleDeleteAddress(req, res) {
  try{
    console.log(`handleDeleteAddress`);

    const building_id = parseInt(req.params.building_id);
    const address_id = parseInt(req.params.address_id);

    await prisma.address.delete({
        where: {
            building_id: building_id,
            address_id: address_id,
        }
    })
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