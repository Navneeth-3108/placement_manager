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

const getApplications = async ({ page, limit, search, StudentID, JobID, Status }, authUser) => {
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

  const studentWhere = {};

  if (search) {
    studentWhere[Op.or] = [{ FirstName: { [Op.like]: `%${search}%` } }, { LastName: { [Op.like]: `%${search}%` } }];
  }

  if (authUser?.role === 'student') {
    if (!authUser.email) {
      throw new ApiError(403, 'Student account must include an email address');
    }
    studentWhere.Email = authUser.email;
  }

  const include = [
    {
      model: Student,
      where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
      required: Object.keys(studentWhere).length > 0,
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

const getApplicationById = async (id, authUser) => {
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

  if (authUser?.role === 'student') {
    if (!authUser.email || application.Student?.Email !== authUser.email) {
      throw new ApiError(403, 'Forbidden: cannot access other student applications');
    }
  }

  return application;
};

const applyForJob = async (payload, authUser) => {
  const transaction = await sequelize.transaction();
  try {
    const student = await Student.findByPk(payload.StudentID, { transaction });
    if (!student) {
      throw new ApiError(404, 'Student not found');
    }

    if (authUser?.role === 'student') {
      if (!authUser.email) {
        throw new ApiError(403, 'Student account must include an email address');
      }
      if (!student.Email || student.Email !== authUser.email) {
        throw new ApiError(403, 'Students can only apply using their own student profile');
      }
    }

    const job = await JobPosting.findByPk(payload.JobID, { transaction });
    if (!job) {
      throw new ApiError(404, 'Job posting not found');
    }

    const existingPlacement = await Placement.findOne({
      include: [
        {
          model: Application,
          where: { StudentID: payload.StudentID },
          required: true,
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (existingPlacement) {
      throw new ApiError(409, 'Student is already placed and cannot apply to new jobs');
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

const updateApplicationStatus = async (id, status, authUser) => {
  const application = await getApplicationById(id, authUser);
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
