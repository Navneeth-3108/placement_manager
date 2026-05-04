const { sequelize, Department, Company, JobPosting, Student, Application, Placement } = require('./models');

const departments = [
  { DeptName: 'Computer Science', HOD: 'Dr. Priya Sharma' },
  { DeptName: 'Electrical Engineering', HOD: 'Dr. Rajiv Menon' },
  { DeptName: 'Mechanical Engineering', HOD: 'Dr. S. Kapoor' },
  { DeptName: 'Civil Engineering', HOD: 'Dr. Anil Verma' },
  { DeptName: 'Electronics & Communication', HOD: 'Dr. Nisha Rao' },
];

const companies = [
  { CompanyName: 'Innova Tech', Industry: 'Software', Location: 'City Center' },
  { CompanyName: 'PowerGrid Systems', Industry: 'Energy', Location: 'Industrial Park' },
  { CompanyName: 'MechWorks Ltd', Industry: 'Manufacturing', Location: 'North Zone' },
  { CompanyName: 'BuildRight', Industry: 'Construction', Location: 'East Wing' },
  { CompanyName: 'ElectroSolve', Industry: 'Electronics', Location: 'Tech Park' },
];

const jobPostings = [
  { JobRole: 'Frontend Developer', Package: 600000, Eligibility: 'B.Tech CSE', CompanyName: 'Innova Tech' },
  { JobRole: 'Backend Developer', Package: 650000, Eligibility: 'B.Tech CSE', CompanyName: 'Innova Tech' },
  { JobRole: 'Power Systems Engineer', Package: 700000, Eligibility: 'B.Tech EEE', CompanyName: 'PowerGrid Systems' },
  { JobRole: 'CAD Engineer', Package: 500000, Eligibility: 'B.Tech ME', CompanyName: 'MechWorks Ltd' },
  { JobRole: 'Site Engineer', Package: 480000, Eligibility: 'B.Tech CE', CompanyName: 'BuildRight' },
  { JobRole: 'Embedded Systems Engineer', Package: 620000, Eligibility: 'B.Tech ECE', CompanyName: 'ElectroSolve' },
];

const students = [
  { FirstName: 'Arjun', LastName: 'Kumar', DOB: '2001-03-12', Gender: 'M', Phone: '9000000001', Email: 'arjun.kumar@example.com', DeptName: 'Computer Science' },
  { FirstName: 'Pooja', LastName: 'Singh', DOB: '2000-07-22', Gender: 'F', Phone: '9000000002', Email: 'pooja.singh@example.com', DeptName: 'Electronics & Communication' },
  { FirstName: 'Rahul', LastName: 'Verma', DOB: '2000-11-05', Gender: 'M', Phone: '9000000003', Email: 'rahul.verma@example.com', DeptName: 'Mechanical Engineering' },
  { FirstName: 'Sneha', LastName: 'Patel', DOB: '2001-01-30', Gender: 'F', Phone: '9000000004', Email: 'sneha.patel@example.com', DeptName: 'Civil Engineering' },
  { FirstName: 'Karan', LastName: 'Sharma', DOB: '1999-09-17', Gender: 'M', Phone: '9000000005', Email: 'karan.sharma@example.com', DeptName: 'Electrical Engineering' },
  { FirstName: 'Maya', LastName: 'Rao', DOB: '2001-05-14', Gender: 'F', Phone: '9000000006', Email: 'maya.rao@example.com', DeptName: 'Computer Science' },
  { FirstName: 'Ishan', LastName: 'Mehta', DOB: '2000-12-02', Gender: 'M', Phone: '9000000007', Email: 'ishan.mehta@example.com', DeptName: 'Electronics & Communication' },
  { FirstName: 'Anita', LastName: 'Desai', DOB: '2001-08-25', Gender: 'F', Phone: '9000000008', Email: 'anita.desai@example.com', DeptName: 'Mechanical Engineering' },
];

const applications = [
  // { studentEmail, jobRole, applyDate, status }
  { studentEmail: 'arjun.kumar@example.com', jobRole: 'Frontend Developer', applyDate: '2024-11-01', status: 'Applied' },
  { studentEmail: 'arjun.kumar@example.com', jobRole: 'Backend Developer', applyDate: '2024-11-03', status: 'Selected' },
  { studentEmail: 'pooja.singh@example.com', jobRole: 'Embedded Systems Engineer', applyDate: '2024-11-02', status: 'Applied' },
  { studentEmail: 'rahul.verma@example.com', jobRole: 'CAD Engineer', applyDate: '2024-11-04', status: 'Rejected' },
  { studentEmail: 'sneha.patel@example.com', jobRole: 'Site Engineer', applyDate: '2024-11-05', status: 'Applied' },
  { studentEmail: 'karan.sharma@example.com', jobRole: 'Power Systems Engineer', applyDate: '2024-11-06', status: 'Selected' },
  { studentEmail: 'maya.rao@example.com', jobRole: 'Frontend Developer', applyDate: '2024-11-07', status: 'Applied' },
  { studentEmail: 'ishan.mehta@example.com', jobRole: 'Embedded Systems Engineer', applyDate: '2024-11-08', status: 'Applied' },
  { studentEmail: 'anita.desai@example.com', jobRole: 'CAD Engineer', applyDate: '2024-11-09', status: 'Applied' },
];

const placements = [
  // will be created for selected application entries
  // { studentEmail, jobRole, offerDate, joiningDate }
  { studentEmail: 'arjun.kumar@example.com', jobRole: 'Backend Developer', offerDate: '2024-11-10', joiningDate: '2025-01-10' },
  { studentEmail: 'karan.sharma@example.com', jobRole: 'Power Systems Engineer', offerDate: '2024-11-15', joiningDate: '2025-02-01' },
];

async function seed() {
  try {
    await sequelize.authenticate();
    // ensure tables exist
    await sequelize.sync();

    // clear previous seeded data (truncate in correct order)
    await Placement.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await Application.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await JobPosting.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await Student.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await Company.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    await Department.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });

    const deptMap = {};
    for (const dept of departments) {
      const instance = await Department.create(dept);
      deptMap[instance.DeptName] = instance.DeptID;
      console.log(`Department: ${instance.DeptName} (${instance.DeptID})`);
    }

    const companyMap = {};
    for (const comp of companies) {
      const instance = await Company.create(comp);
      companyMap[instance.CompanyName] = instance.CompanyID;
      console.log(`Company: ${instance.CompanyName} (${instance.CompanyID})`);
    }

    const jobMap = {};
    for (const job of jobPostings) {
      const companyId = companyMap[job.CompanyName] || null;
      const instance = await JobPosting.create({ JobRole: job.JobRole, Package: job.Package, Eligibility: job.Eligibility, CompanyID: companyId });
      jobMap[`${instance.JobRole}||${instance.CompanyID}`] = instance.JobID;
      console.log(`Job: ${instance.JobRole} (${instance.JobID}) @ company ${instance.CompanyID}`);
    }

    const studentMap = {};
    for (const s of students) {
      const deptId = deptMap[s.DeptName] || null;
      const instance = await Student.create({ FirstName: s.FirstName, LastName: s.LastName, DOB: s.DOB, Gender: s.Gender, Phone: s.Phone, Email: s.Email, DeptID: deptId });
      studentMap[instance.Email || instance.Phone] = instance.StudentID;
      console.log(`Student: ${instance.FirstName} ${instance.LastName} (${instance.StudentID})`);
    }

    // Applications
    const appMap = {};
    for (const a of applications) {
      const student = await Student.findOne({ where: { Email: a.studentEmail } });
      if (!student) continue;
      const job = await JobPosting.findOne({ where: { JobRole: a.jobRole } });
      if (!job) continue;

      // skip creating application if student already has a placement (placed students can't apply further)
      const existingPlacement = await Placement.findOne({
        include: [
          {
            model: Application,
            where: { StudentID: student.StudentID },
            required: true,
          },
        ],
      });
      if (existingPlacement) {
        console.log(`Skipping application for placed student ${student.StudentID}`);
        continue;
      }

      const instance = await Application.create({ StudentID: student.StudentID, JobID: job.JobID, ApplyDate: a.applyDate, Status: a.status });
      appMap[`${student.StudentID}||${job.JobID}`] = instance.AppID;
      console.log(`Application: student ${student.StudentID} -> job ${job.JobID} (${instance.Status})`);
    }

    // Placements for selected apps
    for (const p of placements) {
      const student = await Student.findOne({ where: { Email: p.studentEmail } });
      if (!student) continue;
      const job = await JobPosting.findOne({ where: { JobRole: p.jobRole } });
      if (!job) continue;
      const application = await Application.findOne({ where: { StudentID: student.StudentID, JobID: job.JobID } });
      if (!application) continue;
      await Placement.create({ AppID: application.AppID, OfferDate: p.offerDate, JoiningDate: p.joiningDate });
      console.log(`Placement: App ${application.AppID} -> Offer ${p.offerDate}`);
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seed();
