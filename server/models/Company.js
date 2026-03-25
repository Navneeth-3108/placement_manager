const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define(
  'Company',
  {
    CompanyID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CompanyName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: {
        name: 'uq_company_name',
        msg: 'Company name must be unique',
      },
      validate: {
        notEmpty: { msg: 'CompanyName is required' },
      },
    },
    Industry: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Industry is required' },
      },
    },
    Location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    tableName: 'Company',
  }
);

module.exports = Company;
