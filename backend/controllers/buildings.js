const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function handleGetBuildings(req, res){
    try {
        const { type } = req.params;
        const allBuildings = await prisma.building.findMany({
            where: { building_type: {
                type_name: type,
            } },
            select: { 
                b_name: true,
                address : {
                    select: {
                        street: true,
                        zone: true,
                        pincode: true,
                    }
                },
            }
        });
        return res.status(200).json(allBuildings);

    } catch (error) {
        console.error("Failed to fetch buildings:", error);
        return res.status(500).json({ error: "Unable to fetch data" });
    }
}

module.exports = {
    handleGetBuildings,
}