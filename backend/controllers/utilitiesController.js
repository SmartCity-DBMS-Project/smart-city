const prisma = require('../lib/prisma');

// Get all utilities
const getAllUtilities = async (req, res) => {
  try {
    const utilities = await prisma.utility.findMany({
      select: {
        utility_id: true,
        type: true,
        charge_per_unit: true,
        dept_id: true,
        department: {
          select: {
            dept_name: true
          }
        }
      }
    });
    res.json(utilities);
  } catch (error) {
    console.error('Error fetching utilities:', error);
    res.status(500).json({ error: 'Failed to fetch utilities' });
  }
};

// Get unique utility types
const getUtilityTypes = async (req, res) => {
  try {
    const utilities = await prisma.utility.findMany({
      select: {
        type: true
      },
      distinct: ['type']
    });
    
    // Filter out null/undefined types
    const types = utilities
      .map(u => u.type)
      .filter(type => type != null);
      
    res.json(types);
  } catch (error) {
    console.error('Error fetching utility types:', error);
    res.status(500).json({ error: 'Failed to fetch utility types' });
  }
};

module.exports = {
  getAllUtilities,
  getUtilityTypes
};