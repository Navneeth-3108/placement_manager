const { Op } = require('sequelize');
const { JobPosting, Company } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPagination, getPagingData } = require('../utils/pagination');

const getJobPostings = async ({ page, limit, search, CompanyID }) => {
  const pagination = getPagination(page, limit);
  const where = {};

  if (CompanyID) {
    where.CompanyID = Number(CompanyID);
  }

  if (search) {
    where[Op.or] = [
      { JobRole: { [Op.like]: `%${search}%` } },
      { Eligibility: { [Op.like]: `%${search}%` } },
    ];
  }

  const result = await JobPosting.findAndCountAll({
    where,
    include: [{ model: Company }],
    offset: pagination.offset,
    limit: pagination.limit,
    order: [['JobID', 'ASC']],
  });

  return getPagingData(result, pagination.page, pagination.limit);
};

const getJobPostingById = async (id) => {
  const jobPosting = await JobPosting.findByPk(id, { include: [{ model: Company }] });
  if (!jobPosting) {
    throw new ApiError(404, 'Job posting not found');
  }
  return jobPosting;
};

const createJobPosting = async (payload) => JobPosting.create(payload);

const updateJobPosting = async (id, payload) => {
  const jobPosting = await getJobPostingById(id);
  await jobPosting.update(payload);
  return jobPosting;
};

const deleteJobPosting = async (id) => {
  const jobPosting = await getJobPostingById(id);
  await jobPosting.destroy();
  return true;
};

module.exports = {
  getJobPostings,
  getJobPostingById,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting,
};
