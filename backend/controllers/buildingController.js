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
          building_name: true,
          street: true,
          zone: true,
          pincode: true,
        }
    });

    console.log(buildings);
      
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

    const { building_name, street, zone, pincode, building_type, category, type_id } = req.body;

    // Validate required fields
    if (!building_name || building_name.trim() === "") {
      return res.status(400).json({ error: "Building name is required" });
    }

    if (!street || street.trim() === "") {
      return res.status(400).json({ error: "Street is required" });
    }

    if (!zone || zone.trim() === "") {
      return res.status(400).json({ error: "Zone is required" });
    }

    if (!pincode || pincode.trim() === "") {
      return res.status(400).json({ error: "Pincode is required" });
    }

    // Validate pincode format (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ error: "Pincode must be a 6-digit number" });
    }

    // Check if either type_id or custom type info is provided
    const isCustomType = building_type && category;
    if (!type_id && !isCustomType) {
      return res.status(400).json({ error: "Either type_id or custom building type information is required" });
    }

    // If custom type, validate required fields
    if (isCustomType) {
      if (!building_type || building_type.trim() === "") {
        return res.status(400).json({ error: "Building type name is required for custom types" });
      }

      if (!category || category.trim() === "") {
        return res.status(400).json({ error: "Category is required for custom types" });
      }
    }

    let createdTypeId = type_id;

    // Run inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // If custom type, create the building type first
      if (isCustomType) {
        // Check if type already exists (case insensitive)
        let existingType = await tx.building_type.findFirst({
          where: {
            type_name: {
              equals: building_type,
              mode: 'insensitive'
            }
          }
        });

        if (!existingType) {
          // Create new building type
          const newType = await tx.building_type.create({
            data: {
              type_name: building_type,
              category: category
            }
          });
          createdTypeId = newType.type_id;
        } else {
          createdTypeId = existingType.type_id;
        }
      } else {
        // Validate that type_id exists
        const typeExists = await tx.building_type.findUnique({
          where: { type_id: parseInt(type_id) }
        });

        if (!typeExists) {
          throw new Error("Invalid type_id: Building type does not exist");
        }
      }

      // Create building
      const building = await tx.building.create({
        data: {
          building_name: building_name,
          street: street,
          zone: zone,
          pincode: pincode,
          type_id: parseInt(createdTypeId),
        },
      });

      // Create default address
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
    
    const buildingId = parseInt(req.params.building_id);
    
    // Check if building exists
    const existingBuilding = await prisma.building.findUnique({
      where: { building_id: buildingId },
    });
    
    if (!existingBuilding) {
      return res.status(404).json({ error: 'Building not found' });
    }
    
    await prisma.building.delete({
      where: { building_id: buildingId },
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

// New function to update a building
async function handleUpdateBuilding(req, res) {
  try {
    console.log('Updating Building ID:', req.params.building_id, 'with data:', req.body);

    const building_id = parseInt(req.params.building_id);
    const { building_name, street, zone, pincode, type_id } = req.body;

    // Validate required fields
    if (!building_name || building_name.trim() === "") {
      return res.status(400).json({ error: "Building name is required" });
    }

    if (!street || street.trim() === "") {
      return res.status(400).json({ error: "Street is required" });
    }

    if (!zone || zone.trim() === "") {
      return res.status(400).json({ error: "Zone is required" });
    }

    if (!pincode || pincode.trim() === "") {
      return res.status(400).json({ error: "Pincode is required" });
    }

    // Validate pincode format (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ error: "Pincode must be a 6-digit number" });
    }

    if (!type_id) {
      return res.status(400).json({ error: "Type ID is required" });
    }

    // Check if building exists
    const existingBuilding = await prisma.building.findUnique({
      where: { building_id: building_id },
    });

    if (!existingBuilding) {
      return res.status(404).json({ error: "Building not found" });
    }

    // Check if type_id exists
    const typeExists = await prisma.building_type.findUnique({
      where: { type_id: parseInt(type_id) }
    });

    if (!typeExists) {
      return res.status(400).json({ error: "Invalid type_id: Building type does not exist" });
    }

    const updatedBuilding = await prisma.building.update({
      where: { building_id: building_id },
      data: {
        building_name,
        street,
        zone,
        pincode,
        type_id: parseInt(type_id),
      },
    });

    return res.status(200).json(updatedBuilding);

  } catch (error) {
    console.error('Error updating building:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Building not found' });
    }
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
    handleGetBuildings,
    handleGetBuildingsByType,
    handlePostBuilding,
    handleGetBuildingTypes,
    handleDeleteBuilding,
    handleGetBuildingById,
    handleUpdateBuilding,
}