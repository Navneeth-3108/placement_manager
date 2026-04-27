const express = require('express');
const controller = require('../controllers/placementController');
const { ROLES, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.STUDENT), controller.listPlacements);
router.post('/', authorize(ROLES.ADMIN, ROLES.OFFICER), controller.createPlacement);

module.exports = router;
