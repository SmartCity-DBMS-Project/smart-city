const prisma = require('../lib/prisma');

async function handleGetBuildings(req, res){
  try {
    const allBuildings = await prisma.building.findMany({
        select: { 
          building_id: true,
          building_type: true,
          building_name: true,
          street: true,
          zone: true,
          pincode: true
        }
    });
    return res.status(200).json(allBuildings);
    
  } catch (error) {
    console.error("Failed to fetch buildings:", error.message);
    return res.status(500).json({ 
        error: "Unable to fetch data"
    });
  }
}

async function handleGetBuildingsByType(req, res){
  try {
    const { type } = req.params;

    const buildings = await prisma.building.findMany({
        where: { 
            building_type: {
                type_name: {
                    contains: type,
                    mode: 'insensitive'
                }
            }
        },
        include: { 
            building_type: true,
            address: {
                select: {
                    street: true,
                    zone: true,
                    city: true,
                    pincode: true
                }
            }
        }
    });
    
    // Remove duplicate addresses for each building
    const buildingsWithUniqueAddresses = buildings.map(building => {
        const uniqueAddresses = [];
        const seenAddresses = new Set();
        
        building.address.forEach(addr => {
            // Create a unique key for each address
            const addressKey = `${addr.street}-${addr.zone}-${addr.city}-${addr.pincode}`;
            if (!seenAddresses.has(addressKey)) {
                seenAddresses.add(addressKey);
                uniqueAddresses.push(addr);
            }
        });
        
        return {
            ...building,
            address: uniqueAddresses
        };
    });
      
    return res.status(200).json(buildingsWithUniqueAddresses);

  } catch (error) {
    console.error("Failed to fetch buildings by type:", error.message);
    return res.status(500).json({ 
        error: "Unable to fetch data"
    });
  }
}

async function handlePostBuilding(req, res) {
  try {
    console.log('Creating Building with data:', req.body);

    const typeId = req.body.type_id;

    if (!typeId) {
      return res.status(422).json({ message: "Type_id doesn't exist" });
    }

    // Check if type exists first
    const type = await prisma.building_type.findUnique({
      where: { type_id: typeId },
    });

    if (!type) {
      return res.status(422).json({ message: "Type_id doesn't exist" });
    }

    // Create building and address without a transaction since they're simple operations
    const building = await prisma.building.create({
      data: {
        building_name: req.body.building_name,
        street: req.body.street,
        zone: req.body.zone,
        pincode: req.body.pincode,
        type_id: typeId,
      },
    });

    // Use the building ID and timestamp to create a unique flat number
    const uniqueFlatNo = `DEFAULT_${building.building_id}_${Date.now()}`;
    
    const address = await prisma.address.create({
      data: {
        building_id: building.building_id,
        flat_no: uniqueFlatNo,
      },
    });

    return res.status(201).json({ building, address });

  } catch (error) {
    console.error('Error creating building:', error);
    // Provide more specific error messages based on the error type
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A building with this information already exists' });
    } else if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid type_id provided' });
    } else if (error.code === 'P2024') {
      return res.status(408).json({ error: 'Database timeout - please try again' });
    }
    return res.status(500).json({ error: 'An unexpected error occurred while creating the building' });
  }
}

async function handleGetBuildingTypes(req, res) {
  try {
    console.log("Fetching all building types...");

    const types = await prisma.building_type.findMany({
      select: {
        type_id: true,
        type_name: true,
      },
    });

    if (types.length > 0) {
      console.log("Fetched building types successfully:", types.length);
      return res.status(200).json(types);
    } else {
      console.log("No building types found.");
      return res.status(200).json({ message: "Table is empty", data: [] });
    }

  } catch (error) {
    console.error("Error occurred fetching building types:", error);
    return res.status(500).json({ error: error.message });
  }
}

async function handleDeleteBuilding(req, res){
  try {
    console.log('Deleting building ID:', req.params.building_id);
    
    await prisma.building.delete({
      where: { building_id: parseInt(req.params.building_id) },
    });
    
    console.log('Building deleted successfully');
    return res.status(200).json({ message: 'Building deleted successfully' });
  } catch (error) {
    console.error('Error deleting building:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Building not found' });
    }
    return res.status(500).json({ error: error.message });
  }
}

async function handleAssignCitizensToBuilding(req, res) {
  try{
    const building_id = req.params.building_id;
    console.log(`Adding citizen to building id: `, building_id);
    const citizen_id = req.body.citizen_id;
    const role = req.body.role;
    return res.status(200).json({message: "Success"});
  } catch(error) {
    console.log(`Failed`);
    return res.status(200).json({error: error.message});
  }
}

async function handleGetBuildingById(req, res) {
  try{
    console.log(`handleGetBuildingById`);

    const building_id = parseInt(req.params.building_id);

    const building_data = await prisma.building.findUnique({
      where:{
        building_id: building_id,
      },
      select:{
        building_id: true,
        building_name: true,
        street: true,
        zone: true,
        pincode: true,
        building_type: {
          select: {
            type_name: true,
            category: true,
          },
        },
      }
    })

    return res.status(200).json(building_data);
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}


module.exports = {
    handleGetBuildings,
    handleGetBuildingTypes,
    handleGetBuildingsByType,
    handlePostBuilding,
    handleDeleteBuilding,
    handleAssignCitizensToBuilding,
    handleGetBuildingById,
}