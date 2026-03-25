const express = require('express');
const controller = require('../controllers/applicationController');

const router = express.Router();

router.get('/', controller.listApplications);
router.get('/:id', controller.getApplication);
router.post('/apply', controller.applyForJob);
router.patch('/:id/status', controller.updateApplicationStatus);

module.exports = router;
