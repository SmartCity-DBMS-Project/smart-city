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
        select: {
          building_id: true,
          building_type: true,
          street: true,
          zone: true,
          pincode: true,
        }
    });

    console.log(buildings);
    
    // Remove duplicate addresses for each building
    // const buildingsWithUniqueAddresses = buildings.map(building => {
    //     const uniqueAddresses = [];
    //     const seenAddresses = new Set();
    //     
    //     building.address.forEach(addr => {
    //         // Create a unique key for each address
    //         const addressKey = `${addr.street}-${addr.zone}-${addr.city}-${addr.pincode}`;
    //         if (!seenAddresses.has(addressKey)) {
    //             seenAddresses.add(addressKey);
    //             uniqueAddresses.push(addr);
    //         }
    //     });
    //     
    //     return {
    //         ...building,
    //         address: uniqueAddresses
    //     };
    // });
      
    return res.status(200).json(buildings);

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

    // Run inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Check type exists
      const type = await tx.building_type.findUnique({
        where: { type_id: typeId },
      });

      if (!type) {
        throw new Error("Invalid type_id");
      }

      // 2. Create building
      const building = await tx.building.create({
        data: {
          building_name: req.body.building_name,
          street: req.body.street,
          zone: req.body.zone,
          pincode: req.body.pincode,
          type_id: typeId,
        },
      });

      // 3. Create default address
      const address = await tx.address.create({
        data: {
          building_id: building.building_id,
          flat_no: "DEFAULT", // required because of unique constraint
        },
      });

      return { building, address };
    });

    return res.status(201).json(result);

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
    handleGetBuildingById,
}