const { Op } = require('sequelize');
const { Student, Department } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPagination, getPagingData } = require('../utils/pagination');
const { ciLike } = require('../utils/search');

const getStudents = async ({ page, limit, search, DeptID }) => {
  const pagination = getPagination(page, limit);
  const where = {};

  if (DeptID) {
    where.DeptID = Number(DeptID);
  }

  if (search) {
    where[Op.or] = [ciLike('FirstName', search), ciLike('LastName', search), ciLike('Email', search)];
  }

  const result = await Student.findAndCountAll({
    where,
    include: [{ model: Department }],
    offset: pagination.offset,
    limit: pagination.limit,
    order: [['StudentID', 'ASC']],
  });

  return getPagingData(result, pagination.page, pagination.limit);
};

const getStudentById = async (id) => {
  const student = await Student.findByPk(id, { include: [{ model: Department }] });
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  return student;
};

const createStudent = async (payload) => Student.create(payload);

const updateStudent = async (id, payload) => {
  const student = await getStudentById(id);
  await student.update(payload);
  return student;
};

const deleteStudent = async (id) => {
  const student = await getStudentById(id);
  await student.destroy();
  return true;
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
