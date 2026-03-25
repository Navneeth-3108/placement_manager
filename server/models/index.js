const sequelize = require('../config/database');

const Department = require('./Department');
const Student = require('./Student');
const Company = require('./Company');
const JobPosting = require('./JobPosting');
const Application = require('./Application');
const Placement = require('./Placement');

Department.hasMany(Student, { foreignKey: 'DeptID' });
Student.belongsTo(Department, { foreignKey: 'DeptID' });

Company.hasMany(JobPosting, { foreignKey: 'CompanyID' });
JobPosting.belongsTo(Company, { foreignKey: 'CompanyID' });

Student.hasMany(Application, { foreignKey: 'StudentID' });
JobPosting.hasMany(Application, { foreignKey: 'JobID' });
Application.belongsTo(Student, { foreignKey: 'StudentID' });
Application.belongsTo(JobPosting, { foreignKey: 'JobID' });

Application.hasOne(Placement, { foreignKey: 'AppID' });
Placement.belongsTo(Application, { foreignKey: 'AppID' });

module.exports = {
  sequelize,
  Department,
  Student,
  Company,
  JobPosting,
  Application,
  Placement,
};
