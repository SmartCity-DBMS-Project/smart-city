const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Create a citizen first
    const citizen = await prisma.citizen.create({
      data: {
        full_name: 'Admin User',
        phone: '1234567890',
        gender: 'M',
        dob: new Date('1990-01-01')
      }
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('12345678', salt);

    // Create login record
    const login = await prisma.login.create({
      data: {
        citizen_id: citizen.citizen_id,
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Test user created successfully:');
    console.log('Citizen ID:', citizen.citizen_id);
    console.log('Login ID:', login.login_id);
    console.log('Email:', login.email);
    console.log('Role:', login.role);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();