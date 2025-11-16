const prisma = require('../lib/prisma');

async function handleGetAllCitizens(req, res) {
  try {
    console.log(`handleGetAllCitizens`);

    const citizen_data = await prisma.citizen.findMany({
      select: {
        citizen_id: true,
        full_name: true,
        phone: true,
        gender: true,
        dob: true,
        // Add login email
        login: {
          select: {
            email: true
          }
        }
      },
    });

    // Flatten structure: login is an array
    const formatted = citizen_data.map((c) => ({
      ...c,
      email: c.login?.[0]?.email || null,
    }));

    return res.status(200).json(formatted);

  } catch (error) {
    console.log(`Failed`, error);
    return res.status(500).json({ error: error.message });
  }
}

async function handlePostCitizen(req, res) {
  try {
    const { full_name, phone, gender, dob, email } = req.body;

    // 1️⃣ BASIC VALIDATION
    if (!full_name || full_name.trim() === "") {
      return res.status(400).json({ error: "Full name is required" });
    }

    if (!email || email.trim() === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }

    if (!gender) {
      return res.status(400).json({ error: "Gender is required" });
    }

    if (!dob) {
      return res.status(400).json({ error: "Date of birth is required" });
    }

    // Phone validation (if provided)
    if (phone && !/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({ error: "Phone number must be between 10 and 15 digits" });
    }

    // 2️⃣ CHECK IF EMAIL ALREADY EXISTS BEFORE INSIDE TRANSACTION
    const existing = await prisma.login.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 3️⃣ SAFE TRANSACTION BLOCK
    const result = await prisma.$transaction(async (txn) => {
      const citizen = await txn.citizen.create({
        data: {
          full_name,
          phone,
          gender,
          dob: dob ? new Date(dob) : null,
        },
      });

      const login = await txn.login.create({
        data: {
          citizen_id: citizen.citizen_id,
          email: email,
          password: null,
          role: "CITIZEN",
        },
      });

      return { citizen, login };
    });

    return res.status(200).json(result);

  } catch (error) {
    console.error("Failed to create citizen:", error);

    // Handle Prisma unique constraint error nicely
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }

    return res.status(500).json({ error: error.message });
  }
}


async function handlePatchCitizen(req, res) {
  try {
    const { full_name, phone, gender, dob, email } = req.body;
    const citizen_id = parseInt(req.params.citizen_id);

    // 1️⃣ BASIC VALIDATION
    if (!full_name || full_name.trim() === "") {
      return res.status(400).json({ error: "Full name is required" });
    }

    if (!email || email.trim() === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }

    if (!gender) {
      return res.status(400).json({ error: "Gender is required" });
    }

    if (!dob) {
      return res.status(400).json({ error: "Date of birth is required" });
    }

    // Phone validation (if provided)
    if (phone && !/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({ error: "Phone number must be between 10 and 15 digits" });
    }

    const updated = await prisma.$transaction(async (txn) => {

      // Update citizen data
      const citizen = await txn.citizen.update({
        where: { citizen_id },
        data: {
          full_name,
          phone,
          gender,
          dob: dob ? new Date(dob) : null,
        },
      });

      // Update login email if provided
      const login = await txn.login.updateMany({
        where: { citizen_id },
        data: { email },
      });

      return { citizen, login };
    });

    return res.status(200).json(updated);

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