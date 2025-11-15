const prisma = require('../lib/prisma');

async function handleGetAllCitizens(req, res) {
  try{
    console.log(`handleGetAllCitizens`);
    const citizen_data = await prisma.citizen.findMany({
        select: {
            citizen_id: true,
            full_name: true,
            phone: true,
            gender: true,
            dob: true,
        },
    })
    return res.status(200).json(citizen_data);
  } catch(error) {
    console.log(`Failed`);
    return res.status(500).json({error: error.message});
  }
}

async function handlePostCitizen(req, res) {
  try {
    const { full_name, phone, gender, dob } = req.body;

    const citizen_data = await prisma.citizen.create({
      data: {
        full_name,
        phone,
        gender,
        // convert incoming "YYYY-MM-DD" to a JS Date object
        dob: dob ? new Date(dob) : null
      }
    });

    return res.status(200).json(citizen_data);
  } catch (error) {
    console.error('Failed to create citizen:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function handlePatchCitizen(req, res) {
  try {
    const { full_name, phone, gender, dob } = req.body;

    const citizen_id = parseInt(req.params.citizen_id);

    const new_citizen_data = await prisma.citizen.update({
      where: {
        citizen_id: citizen_id,
      },
      data: {
        citizen_id,
        full_name,
        phone,
        gender,
        // convert incoming "YYYY-MM-DD" to a JS Date object
        dob: dob ? new Date(dob) : null
      }
    });

    return res.status(200).json(new_citizen_data);
  } catch (error) {
    console.error('Failed to create citizen:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function handleDeleteCitizen(req, res) {
  try {
    const citizen_id = parseInt(req.params.citizen_id);

    await prisma.citizen.delete({
      where: {
        citizen_id: citizen_id,
      },
    });

    return res.status(200).json({message: "Successfully deleted: ", citizen_id});
  } catch (error) {
    console.error('Failed to create citizen:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
    handleGetAllCitizens,
    handlePostCitizen,
    handlePatchCitizen,
    handleDeleteCitizen,
}