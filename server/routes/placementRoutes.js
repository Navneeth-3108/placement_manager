const express = require('express');
const controller = require('../controllers/placementController');

const router = express.Router();

router.get('/', controller.listPlacements);
router.post('/', controller.createPlacement);

module.exports = router;
