const prisma = require('../lib/prisma');

async function handleGetAllAddresses(req, res) {
  try {
    console.log(`handleGetAllAddresses`);

    const addresses = await prisma.address.findMany({
      include: {
        building: {
          select: {
            building_name: true,
            street: true,
            zone: true,
          }
        }
      }
    });

    // Flatten the data
    const result = addresses.map(addr => ({
      address_id: addr.address_id,
      flat_no: addr.flat_no,
      building_name: addr.building?.building_name || null,
      street: addr.building?.street || null,
      zone: addr.building?.zone || null,
    }));

    return res.json(result);

  } catch (error) {
    console.log(`Failed`);
    return res.status(500).json({ error: error.message });
  }
}


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

    const { flat_no } = req.body;
    
    // Validate required fields
    if (!flat_no || flat_no.trim() === "") {
      return res.status(400).json({ error: "Flat number is required" });
    }

    const new_address = await prisma.address.create({
        data:{
            building_id: building_id,
            flat_no: flat_no,
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
    
    const { flat_no } = req.body;
    
    // Validate required fields
    if (!flat_no || flat_no.trim() === "") {
      return res.status(400).json({ error: "Flat number is required" });
    }

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
            flat_no: flat_no,
        }
    })
    }
    else{
        new_address = await prisma.address.update({
            where: {
                address_id: address_id,
            },
            data: {
                flat_no: flat_no,
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
    
    // Check if address exists
    const existingAddress = await prisma.address.findUnique({
      where: {
        address_id: address_id,
      },
    });
    
    if (!existingAddress) {
      return res.status(404).json({ error: "Address not found" });
    }

    await prisma.address.delete({
        where: {
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

    const address_details = await prisma.address.findUnique({
        where: {
            address_id: address_id,
        },
        select: {
            address_id: true,
            flat_no: true,
            building_id: true,
        },
    })
    
    if (!address_details) {
        return res.status(404).json({error: "Address not found"});
    }
    
    return res.status(200).json(address_details);
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
    const { citizen_id, role } = req.body;
    console.log(`handlePostCitizensByAddress`, { citizen_id, role });

    const address_id = parseInt(req.params.address_id);
    
    // Validate required fields
    if (!citizen_id) {
      return res.status(400).json({ error: "Citizen ID is required" });
    }
    
    if (!role || role.trim() === "") {
      return res.status(400).json({ error: "Role is required" });
    }

    // Check if citizen exists
    const citizen = await prisma.citizen.findUnique({
        where: {
            citizen_id: parseInt(citizen_id),
        },
    })

    if(!citizen){
        return res.status(400).json({ error: "Citizen doesn't exist" });
    }

    // Check if the citizen-address relationship already exists
    const existingRelationship = await prisma.citizen_address.findUnique({
      where: {
        citizen_id_address_id: {
          citizen_id: parseInt(citizen_id),
          address_id: address_id
        }
      }
    });

    if (existingRelationship) {
      return res.status(400).json({ error: "Citizen is already linked to this address" });
    }

    const citizen_address_data = await prisma.citizen_address.create({
        data: {
            citizen_id: parseInt(citizen_id),
            address_id: address_id,
            role: role,
        }
    })
    return res.status(200).json(citizen_address_data);
  } catch(error) {
    console.log(`Failed`, error);
    return res.status(500).json({ error: error.message });
  }
}

async function handleUpdateCitizenByAddress(req, res) {
  try {
    const { role } = req.body;
    console.log(`handleUpdateCitizenByAddress`, { role });

    const address_id = parseInt(req.params.address_id);
    const citizen_id = parseInt(req.params.citizen_id);
    
    // Validate required fields
    if (!role || role.trim() === "") {
      return res.status(400).json({ error: "Role is required" });
    }

    // Check if the citizen-address relationship exists
    const existingRelationship = await prisma.citizen_address.findUnique({
      where: {
        citizen_id_address_id: {
          citizen_id: citizen_id,
          address_id: address_id
        }
      }
    });

    if (!existingRelationship) {
      return res.status(404).json({ error: "Citizen is not linked to this address" });
    }

    const updated_citizen_address = await prisma.citizen_address.update({
      where: {
        citizen_id_address_id: {
          citizen_id: citizen_id,
          address_id: address_id
        }
      },
      data: {
        role: role,
      }
    });
    
    return res.status(200).json(updated_citizen_address);
  } catch(error) {
    console.log(`Failed`, error);
    return res.status(500).json({ error: error.message });
  }
}

async function handleDeleteCitizenByAddress(req, res) {
  try {
    console.log(`handleDeleteCitizenByAddress`);

    const address_id = parseInt(req.params.address_id);
    const citizen_id = parseInt(req.params.citizen_id);

    // Check if the citizen-address relationship exists
    const existingRelationship = await prisma.citizen_address.findUnique({
      where: {
        citizen_id_address_id: {
          citizen_id: citizen_id,
          address_id: address_id
        }
      }
    });

    if (!existingRelationship) {
      return res.status(404).json({ error: "Citizen is not linked to this address" });
    }

    await prisma.citizen_address.delete({
      where: {
        citizen_id_address_id: {
          citizen_id: citizen_id,
          address_id: address_id
        }
      }
    });
    
    return res.status(200).json({ message: "Citizen removed from address successfully" });
  } catch(error) {
    console.log(`Failed`, error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleGetAllAddresses,
  handleGetAddressesByBuilding,
  handleAddAddressToBuilding,
  handleUpdateAddress,
  handleDeleteAddress,
  handleGetAddressDetails,
  handleGetCitizensByAddress,
  handlePostCitizensByAddress,
  handleUpdateCitizenByAddress,
  handleDeleteCitizenByAddress
}