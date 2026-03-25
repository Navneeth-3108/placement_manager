const { Op } = require('sequelize');
const {
  sequelize,
  Application,
  Student,
  JobPosting,
  Company,
  Placement,
} = require('../models');
const ApiError = require('../utils/ApiError');
const { getPagination, getPagingData } = require('../utils/pagination');

const getApplications = async ({ page, limit, search, StudentID, JobID, Status }) => {
  const pagination = getPagination(page, limit);
  const where = {};

  if (StudentID) {
    where.StudentID = Number(StudentID);
  }
  if (JobID) {
    where.JobID = Number(JobID);
  }
  if (Status) {
    where.Status = Status;
  }

  const include = [
    {
      model: Student,
      where: search
        ? {
            [Op.or]: [
              { FirstName: { [Op.like]: `%${search}%` } },
              { LastName: { [Op.like]: `%${search}%` } },
            ],
          }
        : undefined,
      required: !!search,
    },
    {
      model: JobPosting,
      include: [{ model: Company }],
    },
    {
      model: Placement,
    },
  ];

  const result = await Application.findAndCountAll({
    where,
    include,
    offset: pagination.offset,
    limit: pagination.limit,
    order: [['AppID', 'DESC']],
  });

  return getPagingData(result, pagination.page, pagination.limit);
};

const getApplicationById = async (id) => {
  const application = await Application.findByPk(id, {
    include: [
      { model: Student },
      {
        model: JobPosting,
        include: [{ model: Company }],
      },
      { model: Placement },
    ],
  });

  if (!application) {
    throw new ApiError(404, 'Application not found');
  }
  return application;
};

const applyForJob = async (payload) => {
  const transaction = await sequelize.transaction();
  try {
    const student = await Student.findByPk(payload.StudentID, { transaction });
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    const job = await JobPosting.findByPk(payload.JobID, { transaction });
    if (!job) {
      throw new ApiError(404, 'Job posting not found');
    }

    const duplicate = await Application.findOne({
      where: {
        StudentID: payload.StudentID,
        JobID: payload.JobID,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (duplicate) {
      throw new ApiError(409, 'Student has already applied for this job');
    }

    const application = await Application.create(payload, { transaction });
    await transaction.commit();
    return application;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateApplicationStatus = async (id, status) => {
  const application = await getApplicationById(id);
  application.Status = status;
  await application.save();
  return application;
};

module.exports = {
  getApplications,
  getApplicationById,
  applyForJob,
  updateApplicationStatus,
};
