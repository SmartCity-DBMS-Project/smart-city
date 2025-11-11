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

    // Generate a unique build_id (manual since not auto-increment)
    const maxBuilding = await prisma.building.findFirst({
      orderBy: { build_id: 'desc' },
      select: { build_id: true }
    });
    const newBuildId = maxBuilding ? maxBuilding.build_id + 1 : 1;

    const { building_name, type_id: incomingTypeId, building_type, category } = req.body;

    let type_id = null;

    // If frontend sends a numeric type_id — validate it
    if (incomingTypeId) {
      const existingType = await prisma.building_type.findUnique({
        where: { type_id: Number(incomingTypeId) }
      });

      if (!existingType) {
        return res.status(400).json({ error: 'Invalid type_id provided' });
      }

      type_id = existingType.type_id;
    } 
    // If frontend sends a building_type name — create new type
    else if (building_type) {
      const maxType = await prisma.building_type.findFirst({
        orderBy: { type_id: 'desc' },
        select: { type_id: true }
      });

      const newTypeId = maxType ? maxType.type_id + 1 : 1;

      const newType = await prisma.building_type.create({
        data: {
          type_id: newTypeId,
          type_name: building_type,
          category: category || null,
        }
      });

      console.log('Created new type:', newType);
      type_id = newType.type_id;
    } 
    else {
      return res.status(400).json({ error: 'Either type_id or building_type must be provided' });
    }

    // Create the building record
    const buildingData = {
      build_id: newBuildId,
      b_name: building_name,
      type_id: type_id,
    };

    const building = await prisma.building.create({ data: buildingData });

    console.log('Building created successfully:', building);
    return res.status(201).json(building);

  } catch (error) {
    console.error('Error creating building:', error);
    return res.status(500).json({ error: error.message });
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
      where: { build_id: parseInt(req.params.id) },
    });
    
    console.log('Building deleted successfully');
    return res.status(200).json({ message: 'Building deleted successfully' });
  } catch (error) {
    console.error('Error deleting building:', error);
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