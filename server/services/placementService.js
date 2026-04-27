const { Op } = require('sequelize');
const { sequelize, Placement, Application, Student, JobPosting, Company } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPagination, getPagingData } = require('../utils/pagination');

const getPlacements = async ({ page, limit }, authUser) => {
  const pagination = getPagination(page, limit);
  const studentWhere = {};

  if (authUser?.role === 'student') {
    if (!authUser.email) {
      throw new ApiError(403, 'Student account must include an email address');
    }
    studentWhere.Email = authUser.email;
  }

  const result = await Placement.findAndCountAll({
    include: [
      {
        model: Application,
        include: [
          {
            model: Student,
            where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
            required: Object.keys(studentWhere).length > 0,
          },
          {
            model: JobPosting,
            include: [{ model: Company }],
          },
        ],
      },
    ],
    offset: pagination.offset,
    limit: pagination.limit,
    order: [['PlaceID', 'DESC']],
  });

  return getPagingData(result, pagination.page, pagination.limit);
};

const createPlacement = async (payload, authUser) => {
  const transaction = await sequelize.transaction();

  try {
    const application = await Application.findByPk(payload.AppID, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    if (application.Status !== 'Selected') {
      throw new ApiError(400, 'Placement can only be created for selected applications');
    }

    const existingPlacement = await Placement.findOne({
      where: { AppID: payload.AppID },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (existingPlacement) {
      throw new ApiError(409, 'Placement already exists for this application');
    }

    if (authUser?.role === 'student') {
      throw new ApiError(403, 'Forbidden: students cannot create placements');
    }

    const placement = await Placement.create(payload, { transaction });

    // Once a student is placed, close all their other active applications.
    await Application.update(
      { Status: 'Rejected' },
      {
        where: {
          StudentID: application.StudentID,
          AppID: { [Op.ne]: payload.AppID },
          Status: { [Op.in]: ['Applied', 'Selected'] },
        },
        transaction,
      }
    );

    await transaction.commit();

    return placement;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getPlacements,
  createPlacement,
};
