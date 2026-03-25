const { sequelize, Placement, Application, Student, JobPosting, Company } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPagination, getPagingData } = require('../utils/pagination');

const getPlacements = async ({ page, limit }) => {
  const pagination = getPagination(page, limit);
  const result = await Placement.findAndCountAll({
    include: [
      {
        model: Application,
        include: [
          { model: Student },
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

const createPlacement = async (payload) => {
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

    const placement = await Placement.create(payload, { transaction });
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
