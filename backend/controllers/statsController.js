const prisma = require('../lib/prisma');

async function getStats(req, res) {
  try {
    const [totalCitizens, totalBills, pendingRequests, overdueBills] = await Promise.all([
      prisma.citizen.count(),
      prisma.bill.count(),
      prisma.request.count({ where: { status: 'PENDING' } }),
      prisma.bill.count({ where: { status: 'OVERDUE' } }),
    ]);

    return res.json({
      totalCitizens,
      totalBills,
      pendingRequests,
      overdueBills,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

module.exports = { getStats };
