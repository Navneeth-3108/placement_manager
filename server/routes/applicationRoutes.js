const express = require('express');
const controller = require('../controllers/applicationController');
const { ROLES, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.STUDENT), controller.listApplications);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.STUDENT), controller.getApplication);
router.post('/apply', authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.STUDENT), controller.applyForJob);
router.patch('/:id/status', authorize(ROLES.ADMIN, ROLES.OFFICER), controller.updateApplicationStatus);

module.exports = router;
