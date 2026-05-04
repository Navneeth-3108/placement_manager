const { Op } = require('sequelize');
const { Company } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPagination, getPagingData } = require('../utils/pagination');
const { ciLike, toSearchNumber } = require('../utils/search');

const getCompanies = async ({ page, limit, search }) => {
  const pagination = getPagination(page, limit);
  const where = {};
  if (search) {
    const searchId = toSearchNumber(search);
    where[Op.or] = [ciLike('CompanyName', search)];
    if (searchId !== null) {
      where[Op.or].push({ CompanyID: searchId });
    }
  }

  const result = await Company.findAndCountAll({
    where,
    offset: pagination.offset,
    limit: pagination.limit,
    order: [['CompanyID', 'ASC']],
  });

  return getPagingData(result, pagination.page, pagination.limit);
};

const getCompanyById = async (id) => {
  const company = await Company.findByPk(id);
  if (!company) {
    throw new ApiError(404, 'Company not found');
  }
  return company;
};

const createCompany = async (payload) => Company.create(payload);

const updateCompany = async (id, payload) => {
  const company = await getCompanyById(id);
  await company.update(payload);
  return company;
};

const deleteCompany = async (id) => {
  const company = await getCompanyById(id);
  await company.destroy();
  return true;
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};
