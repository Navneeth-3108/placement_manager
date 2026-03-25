const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define(
  'Department',
  {
    DeptID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    DeptName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: {
        name: 'uq_department_name',
        msg: 'Department name must be unique',
      },
      validate: {
        notEmpty: { msg: 'DeptName is required' },
      },
    },
    HOD: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'HOD is required' },
      },
    },
    Location: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    tableName: 'Department',
  }
);

module.exports = Department;
