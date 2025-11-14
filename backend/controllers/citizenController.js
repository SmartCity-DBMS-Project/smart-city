const prisma = require('../lib/prisma');

async function handleGetAllCitizens(req, res) {
  try{
    console.log(`handleGetAllCitizens`);
    const citizen_data = await prisma.citizen.findMany({
        select: {
            citizen_id: true,
            full_name: true,
        },
    })
    return res.status(200).json(citizen_data);
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}


module.exports = {
    handleGetAllCitizens,
}