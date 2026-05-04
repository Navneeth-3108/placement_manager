const { Op } = require('sequelize');
const { Department } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPagination, getPagingData } = require('../utils/pagination');
const { ciLike } = require('../utils/search');

const getDepartments = async ({ page, limit, search }) => {
  const pagination = getPagination(page, limit);
  const where = {};
  if (search) {
    where[Op.or] = [ciLike('DeptName', search)];
  }

  const result = await Department.findAndCountAll({
    where,
    offset: pagination.offset,
    limit: pagination.limit,
    order: [['DeptID', 'ASC']],
  });

  return getPagingData(result, pagination.page, pagination.limit);
};

const getDepartmentById = async (id) => {
  const department = await Department.findByPk(id);
  if (!department) {
    throw new ApiError(404, 'Department not found');
  }
  return department;
};

const createDepartment = async (payload) => Department.create(payload);

const updateDepartment = async (id, payload) => {
  const department = await getDepartmentById(id);
  await department.update(payload);
  return department;
};

const deleteDepartment = async (id) => {
  const department = await getDepartmentById(id);
  await department.destroy();
  return true;
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
