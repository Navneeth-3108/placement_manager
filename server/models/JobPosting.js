const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobPosting = sequelize.define(
  'JobPosting',
  {
    JobID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    JobRole: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'JobRole is required' },
      },
    },
    Package: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Package must be an integer' },
        min: { args: [0], msg: 'Package cannot be negative' },
      },
    },
    Eligibility: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Eligibility is required' },
      },
    },
    CompanyID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Company',
        key: 'CompanyID',
      },
    },
  },
  {
    tableName: 'JobPosting',
  }
);

module.exports = JobPosting;
