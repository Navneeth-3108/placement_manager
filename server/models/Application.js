const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define(
  'Application',
  {
    AppID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    StudentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Student',
        key: 'StudentID',
      },
    },
    JobID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'JobPosting',
        key: 'JobID',
      },
    },
    ApplyDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'ApplyDate must be a valid date' },
      },
    },
    Status: {
      type: DataTypes.ENUM('Applied', 'Selected', 'Rejected'),
      allowNull: false,
      defaultValue: 'Applied',
    },
  },
  {
    tableName: 'Application',
    indexes: [
      {
        name: 'uq_application_student_job',
        unique: true,
        fields: ['StudentID', 'JobID'],
      },
    ],
  }
);

module.exports = Application;
