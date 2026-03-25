const express = require('express');

const departmentRoutes = require('./departmentRoutes');
const studentRoutes = require('./studentRoutes');
const companyRoutes = require('./companyRoutes');
const jobPostingRoutes = require('./jobPostingRoutes');
const applicationRoutes = require('./applicationRoutes');
const placementRoutes = require('./placementRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

router.use('/departments', departmentRoutes);
router.use('/students', studentRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobPostingRoutes);
router.use('/applications', applicationRoutes);
router.use('/placements', placementRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
