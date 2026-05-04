const applicationService = require('../services/applicationService');
const asyncHandler = require('../middleware/asyncHandler');
const { ensureNumber, ensureRequired } = require('../utils/validators');
const ApiError = require('../utils/ApiError');

const listApplications = asyncHandler(async (req, res) => {
  const result = await applicationService.getApplications(req.query, req.authUser);
  res.json({ success: true, ...result });
});

const getApplication = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Application ID');
  const data = await applicationService.getApplicationById(id, req.authUser);
  res.json({ success: true, data });
});

const { Student } = require('../models');

const applyForJob = asyncHandler(async (req, res) => {
  // allow StudentID to be omitted for authenticated student users
  ensureRequired(req.body, ['JobID', 'ApplyDate']);

  let studentId = req.body.StudentID;
  if (!studentId && req.authUser?.role === 'student') {
    if (!req.authUser.email) {
      throw new ApiError(403, 'Student account must include an email address');
    }
    const student = await Student.findOne({ where: { Email: req.authUser.email } });
    if (!student) {
      throw new ApiError(404, 'Student profile not found for authenticated student');
    }
    studentId = student.StudentID;
  }

  if (!studentId) {
    throw new ApiError(400, 'Missing required field: StudentID');
  }

  const payload = {
    StudentID: ensureNumber(studentId, 'StudentID'),
    JobID: ensureNumber(req.body.JobID, 'JobID'),
    ApplyDate: req.body.ApplyDate,
    Status: req.body.Status || 'Applied',
  };

  const data = await applicationService.applyForJob(payload, req.authUser);
  res.status(201).json({ success: true, data });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Application ID');
  ensureRequired(req.body, ['Status']);

  const allowedStatuses = ['Applied', 'Selected', 'Rejected'];
  if (!allowedStatuses.includes(req.body.Status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const data = await applicationService.updateApplicationStatus(id, req.body.Status, req.authUser);
  res.json({ success: true, data });
});

module.exports = {
  listApplications,
  getApplication,
  applyForJob,
  updateApplicationStatus,
};
