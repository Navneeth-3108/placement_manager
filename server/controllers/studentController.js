const studentService = require('../services/studentService');
const asyncHandler = require('../middleware/asyncHandler');
const { ensureNumber, ensureRequired } = require('../utils/validators');

const listStudents = asyncHandler(async (req, res) => {
  const result = await studentService.getStudents(req.query);
  res.json({ success: true, ...result });
});

const getStudent = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Student ID');
  const data = await studentService.getStudentById(id);
  res.json({ success: true, data });
});

const createStudent = asyncHandler(async (req, res) => {
  ensureRequired(req.body, ['FirstName', 'LastName', 'DOB']);
  const data = await studentService.createStudent(req.body);
  res.status(201).json({ success: true, data });
});

const updateStudent = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Student ID');
  const data = await studentService.updateStudent(id, req.body);
  res.json({ success: true, data });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const id = ensureNumber(req.params.id, 'Student ID');
  await studentService.deleteStudent(id);
  res.json({ success: true, message: 'Student deleted successfully' });
});

module.exports = {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
