const { Student, Company, JobPosting, Application, Placement } = require('../models');

const getDashboardStats = async () => {
  const [students, companies, jobs, applications, placements, selected] = await Promise.all([
    Student.count(),
    Company.count(),
    JobPosting.count(),
    Application.count(),
    Placement.count(),
    Application.count({ where: { Status: 'Selected' } }),
  ]);

  return {
    students,
    companies,
    jobs,
    applications,
    placements,
    selected,
  };
};

module.exports = {
  getDashboardStats,
};
