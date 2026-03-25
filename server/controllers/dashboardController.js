const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../middleware/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardStats();
  res.json({ success: true, data });
});

module.exports = {
  getDashboardStats,
};
