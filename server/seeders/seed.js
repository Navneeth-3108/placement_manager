const dotenv = require('dotenv');
const {
  sequelize,
  Department,
  Student,
  Company,
  JobPosting,
  Application,
  Placement,
} = require('../models');

dotenv.config();

const seed = async () => {
  let transaction;
  try {
    await sequelize.sync({ force: true });
    transaction = await sequelize.transaction();

    const departments = await Department.bulkCreate(
      [
        { DeptName: 'Computer Science', HOD: 'Dr. Asha Menon', Location: 'Block A' },
        { DeptName: 'Electronics', HOD: 'Dr. Rahul Verma', Location: 'Block B' },
        { DeptName: 'Mechanical', HOD: 'Dr. Kiran Das', Location: 'Block C' },
      ],
      { transaction }
    );

    const students = await Student.bulkCreate(
      [
        {
          FirstName: 'Arun',
          LastName: 'Kumar',
          DOB: '2003-01-15',
          Gender: 'M',
          Phone: '9000000001',
          Email: 'arun.kumar@example.com',
          DeptID: departments[0].DeptID,
        },
        {
          FirstName: 'Nisha',
          LastName: 'Rao',
          DOB: '2003-07-03',
          Gender: 'F',
          Phone: '9000000002',
          Email: 'nisha.rao@example.com',
          DeptID: departments[1].DeptID,
        },
        {
          FirstName: 'Vikram',
          LastName: 'Iyer',
          DOB: '2002-11-21',
          Gender: 'M',
          Phone: '9000000003',
          Email: 'vikram.iyer@example.com',
          DeptID: departments[0].DeptID,
        },
      ],
      { transaction }
    );

    const companies = await Company.bulkCreate(
      [
        { CompanyName: 'TechNova', Industry: 'Software', Location: 'Bengaluru' },
        { CompanyName: 'FinSage', Industry: 'Fintech', Location: 'Mumbai' },
      ],
      { transaction }
    );

    const jobs = await JobPosting.bulkCreate(
      [
        {
          JobRole: 'Software Engineer',
          Package: 1200000,
          Eligibility: 'B.Tech CSE, CGPA 7+',
          CompanyID: companies[0].CompanyID,
        },
        {
          JobRole: 'Data Analyst',
          Package: 900000,
          Eligibility: 'Any branch, SQL and Python',
          CompanyID: companies[1].CompanyID,
        },
      ],
      { transaction }
    );

    const applications = await Application.bulkCreate(
      [
        {
          StudentID: students[0].StudentID,
          JobID: jobs[0].JobID,
          ApplyDate: '2026-02-01',
          Status: 'Selected',
        },
        {
          StudentID: students[1].StudentID,
          JobID: jobs[1].JobID,
          ApplyDate: '2026-02-05',
          Status: 'Applied',
        },
        {
          StudentID: students[2].StudentID,
          JobID: jobs[0].JobID,
          ApplyDate: '2026-02-09',
          Status: 'Rejected',
        },
      ],
      { transaction }
    );

    await Placement.create(
      {
        AppID: applications[0].AppID,
        OfferDate: '2026-03-01',
        JoiningDate: '2026-06-15',
      },
      { transaction }
    );

    await transaction.commit();
    console.log('Seed data inserted successfully.');
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

seed();
