const express = require('express');
const controller = require('../controllers/jobPostingController');

const router = express.Router();

router.get('/', controller.listJobs);
router.get('/:id', controller.getJob);
router.post('/', controller.createJob);
router.put('/:id', controller.updateJob);
router.delete('/:id', controller.deleteJob);

module.exports = router;
