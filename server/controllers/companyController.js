const companyService = require('../services/companyService');
const asyncHandler = require('../middleware/asyncHandler');
const { ensureNumber, ensureRequired } = require('../utils/validators');

const listCompanies = asyncHandler(async (req, res) => {
  const result = await companyService.getCompanies(req.query);
  res.json({ success: true, ...result });
});

const getCompany = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Company ID');
  const data = await companyService.getCompanyById(id);
  res.json({ success: true, data });
});

const createCompany = asyncHandler(async (req, res) => {
  ensureRequired(req.body, ['CompanyName', 'Industry']);
  const data = await companyService.createCompany(req.body);
  res.status(201).json({ success: true, data });
});

const updateCompany = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Company ID');
  const data = await companyService.updateCompany(id, req.body);
  res.json({ success: true, data });
});

const deleteCompany = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Company ID');
  await companyService.deleteCompany(id);
  res.json({ success: true, message: 'Company deleted successfully' });
});

module.exports = {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
};
