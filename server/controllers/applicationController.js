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

const applyForJob = asyncHandler(async (req, res) => {
  ensureRequired(req.body, ['StudentID', 'JobID', 'ApplyDate']);
  const payload = {
    StudentID: ensureNumber(req.body.StudentID, 'StudentID'),
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
