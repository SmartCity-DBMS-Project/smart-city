const prisma = require('../lib/prisma');

async function handleGetCitizensByAddress(req, res) {
  try{
    console.log(`handleGetCitizensByAddress`);
    return res.status(200).json({message: "Success"});
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}


module.exports = {
    handleGetCitizensByAddress,
}