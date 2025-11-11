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

async function handleGetAddressDetails(req, res) {
  try {
    console.log(`handleGetAddressDetails`)

    const address_id = parseInt(req.params.address_id);

    const address_details = await prisma.address.findMany({
        where: {
            address_id: address_id,
        },
        select: {
            flat_no: true,
        },
    })
    return res.status(200).json({message: "Success"});
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}

async function handleGetCitizensByAddress(req, res) {
  try {
    console.log(`handleGetCitizensByAddress`);

    const address_id = parseInt(req.params.address_id);

    const citizens_data = await prisma.citizen_address.findMany({
      where: { address_id },
      select: {
        citizen_id: true,
        role: true,
        start_date: true,
        end_date: true,
        citizen: {
          select: {
            full_name: true,
            phone: true,
            gender: true,
          },
        },
      },
    });
    return res.status(200).json(citizens_data);
  } catch (error) {
    console.log(`Failed`, error);
    return res.status(500).json({ error: error.message });
  }
}

async function handlePostCitizensByAddress(req, res) {
  try {
    // citizen_id: "",
    // role: "",
    // start_date: "",
    console.log(`handleGetAddressDetails`)

    const address_id = parseInt(req.params.address_id);

    const citizen_id = req.body.citizen_id;

    const citizen = await prisma.citizen.findUnique({
        where: {
            citizen_id: citizen_id,
        },
    })

    if(!citizen){
        res.status(500).json({message: "Citizen doesn't exist"});
    }

    const citizen_address_data = await prisma.citizen_address.create({
        data: {
            citizen_id: citizen_id,
            address_id: address_id,
            role: req.body.role,
            start_date: req.body.start_date || null,
            end_date: null,
        }
    })
    return res.status(200).json(citizen_address_data);
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}

async function handlePatchCitizensByAddress(req, res) {
  try {
    // citizen_id: "",
    // role: "",
    // start_date: "",
    console.log(`handlePatchCitizensByAddress`)

    const address_id = parseInt(req.params.address_id);
    const citizen_id = parseInt(req.params.citizen_id);

    const citizen = await prisma.citizen.findUnique({
        where: {
            citizen_id: citizen_id,
        },
    })

    if(!citizen){
        res.status(500).json({error: error.message, message: "Citizen doesn't exist"});
    }

    const citizen_address_data = await prisma.citizen_address.update({
        where: {
            citizen_id_address_id: { citizen_id, address_id },
        },
        data: {
            role: req.body.role,
            start_date: req.body.start_date || null,
            end_date: null,
        }
    })
    return res.status(200).json(citizen_address_data);
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}

async function handleDeleteCitizensByAddress(req, res) {
  try {
    console.log(`handleDeleteCitizensByAddress`)

    const address_id = parseInt(req.params.address_id);
    const citizen_id = parseInt(req.params.citizen_id);

    await prisma.citizen_address.delete({
        where: {
            citizen_id_address_id: { citizen_id, address_id },
        },
    })
    return res.status(200).json({message: "Successfully removed citizen from building"});
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
    handleGetAddressDetails,
    handleGetCitizensByAddress,
    handlePostCitizensByAddress,
    handlePatchCitizensByAddress,
    handleDeleteCitizensByAddress,
}