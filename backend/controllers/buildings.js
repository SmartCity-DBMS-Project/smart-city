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

module.exports = {
    handleGetBuildings,
    handleGetBuildingsByType
}