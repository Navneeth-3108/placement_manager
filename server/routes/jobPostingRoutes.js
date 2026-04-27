const express = require('express');
const controller = require('../controllers/jobPostingController');
const { ROLES, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.STUDENT), controller.listJobs);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.STUDENT), controller.getJob);
router.post('/', authorize(ROLES.ADMIN, ROLES.OFFICER), controller.createJob);
router.put('/:id', authorize(ROLES.ADMIN, ROLES.OFFICER), controller.updateJob);
router.delete('/:id', authorize(ROLES.ADMIN), controller.deleteJob);

module.exports = router;
