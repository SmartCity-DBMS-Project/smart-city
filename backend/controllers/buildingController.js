const prisma = require('../lib/prisma');

async function handleGetBuildings(req, res){
    try {
        const allBuildings = await prisma.building.findMany({
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
        const buildingsWithUniqueAddresses = allBuildings.map(building => {
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

async function handlePostBuilding(req, res){
    try {
    console.log('Creating Building with data:', req.body);
    
    // Generate a unique bill_id by finding the max bill_id and adding 1
    const maxBuilding = await prisma.building.findFirst({
      orderBy: { build_id: 'desc' },
      select: { build_id: true }
    });
    
    const newBuildId = maxBuilding ? maxBuilding.build_id + 1 : 1;
    
    // Map frontend data to database schema
    // Frontend sends: { building_name, building_type, type_id, category }
    // Database expects: { build_id, b_name, type_id }
    const { building_type, ...restData } = req.body;
    
    let type_id = null;
    
    // If building_type is provided, find or create the type
    if (building_type) {
      // Try to find existing type with this type
      let type = await prisma.building_type.findFirst({
        where: { type_id: building_type }
      });
      
      // If not found, create a new type
      if (!type) {
        // Find max type_id to generate new one
        const maxType = await prisma.building_type.findFirst({
          orderBy: { type_id: 'desc' },
          select: { type_id: true }
        });
        const newTypeId = maxType ? maxType.type_id + 1 : 1;
        
        type = await prisma.building_type.create({
          data: {
            type_id: newTypeId,
            type_name: req.building_type,
            category: req.category,
          }
        });
        console.log('Created new type:', type);
      }
      
      type_id = type.type_id;
    }
    
    const buildingData = {
      build_id: newBuildId,
      b_name: req.b_name,
      type_id: type_id,
    };
    
    const building = await prisma.building.create({ 
      data: buildingData
    });
    
    console.log('Building created successfully:', bill);
    return res.status(201).json(building);
  } catch (error) {
    console.error('Error creating building:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
    handleGetBuildings,
    handleGetBuildingsByType,
    handlePostBuilding,
}