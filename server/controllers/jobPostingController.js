const jobPostingService = require('../services/jobPostingService');
const asyncHandler = require('../middleware/asyncHandler');
const { ensureNumber, ensureRequired } = require('../utils/validators');

const listJobs = asyncHandler(async (req, res) => {
  const result = await jobPostingService.getJobPostings(req.query);
  res.json({ success: true, ...result });
});

const getJob = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Job ID');
  const data = await jobPostingService.getJobPostingById(id);
  res.json({ success: true, data });
});

const createJob = asyncHandler(async (req, res) => {
  ensureRequired(req.body, ['JobRole', 'Package', 'Eligibility', 'CompanyID']);
  const data = await jobPostingService.createJobPosting(req.body);
  res.status(201).json({ success: true, data });
});

const updateJob = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Job ID');
  const data = await jobPostingService.updateJobPosting(id, req.body);
  res.json({ success: true, data });
});

const deleteJob = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Job ID');
  await jobPostingService.deleteJobPosting(id);
  res.json({ success: true, message: 'Job posting deleted successfully' });
});

module.exports = {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
