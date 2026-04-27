const express = require('express');
const controller = require('../controllers/dashboardController');
const { ROLES, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authorize(ROLES.ADMIN, ROLES.OFFICER), controller.getDashboardStats);

module.exports = router;
