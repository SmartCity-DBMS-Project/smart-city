const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function handleGetBuildings(req, res){
    try {
        const allBuildings = await prisma.building_type.findMany();
        return res.status(200).json(allBuildings);

    } catch (error) {
        console.error("Failed to fetch buildings:", error);
        return res.status(500).json({ error: "Unable to fetch data" });
    }
}

module.exports = {
    handleGetBuildings,
}