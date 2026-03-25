const departmentService = require('../services/departmentService');
const asyncHandler = require('../middleware/asyncHandler');
const { ensureNumber, ensureRequired } = require('../utils/validators');

const listDepartments = asyncHandler(async (req, res) => {
  const result = await departmentService.getDepartments(req.query);
  res.json({ success: true, ...result });
});

const getDepartment = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Department ID');
  const data = await departmentService.getDepartmentById(id);
  res.json({ success: true, data });
});

const createDepartment = asyncHandler(async (req, res) => {
  ensureRequired(req.body, ['DeptName', 'HOD']);
  const data = await departmentService.createDepartment(req.body);
  res.status(201).json({ success: true, data });
});

const updateDepartment = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Department ID');
  const data = await departmentService.updateDepartment(id, req.body);
  res.json({ success: true, data });
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Department ID');
  await departmentService.deleteDepartment(id);
  res.json({ success: true, message: 'Department deleted successfully' });
});

module.exports = {
  listDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
