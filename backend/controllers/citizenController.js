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
    const { full_name, phone, gender, dob, email } = req.body;

    // Transaction to create email when citizen is created
    const result = await prisma.$transaction(async (txn) => {
      const citizen = await prisma.citizen.create({
        data: {
          full_name,
          phone,
          gender,
          dob: dob ? new Date(dob) : null,
        },
      });

      const login = await prisma.login.create({
        data: {
          citizen_id: citizen.citizen_id,
          email: email,
          password: null,
          role: 'CITIZEN',
        },
      });

      return {
        citizen,
        login,
      };
    });

    return res.status(200).json(result);
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
        full_name,
        phone,
        gender,
        // convert incoming "YYYY-MM-DD" to a JS Date object
        dob: dob ? new Date(dob) : null
      }
    });

    return res.status(200).json(new_citizen_data);
  } catch (error) {
    console.error('Failed to update citizen:', error);
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

    return res.status(200).json({message: "Successfully deleted citizen", citizen_id});
  } catch (error) {
    console.error('Failed to delete citizen:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
    handleGetAllCitizens,
    handlePostCitizen,
    handlePatchCitizen,
    handleDeleteCitizen,
}