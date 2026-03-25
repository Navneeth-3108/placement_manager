const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define(
  'Student',
  {
    StudentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    FirstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'FirstName is required' },
      },
    },
    LastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'LastName is required' },
      },
    },
    DOB: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: 'DOB must be a valid date' },
      },
    },
    Gender: {
      type: DataTypes.ENUM('M', 'F'),
      allowNull: true,
    },
    Phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: {
        name: 'uq_student_phone',
        msg: 'Phone must be unique',
      },
    },
    Email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      unique: {
        name: 'uq_student_email',
        msg: 'Email must be unique',
      },
      validate: {
        isEmail: { msg: 'Email format is invalid' },
      },
    },
    DeptID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Department',
        key: 'DeptID',
      },
    },
  },
  {
    tableName: 'Student',
  }
);

module.exports = Student;
