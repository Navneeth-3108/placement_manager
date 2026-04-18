import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import usePaginatedResource from '../hooks/usePaginatedResource';
import { getList, patchItem, postItem } from '../services/endpoints';

const ApplicationsPage = () => {
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ search: '', Status: '' });
  const [form, setForm] = useState({ StudentID: '', JobID: '', ApplyDate: '' });

  const fetchApplications = useCallback(
    (query) => getList('/applications', { ...query, ...filters }),
    [filters]
  );

  const { data, pagination, query, setQuery, reload, error } = usePaginatedResource(fetchApplications);

  useEffect(() => {
    Promise.all([getList('/students', { page: 1, limit: 200 }), getList('/jobs', { page: 1, limit: 200 })])
      .then(([studentsRes, jobsRes]) => {
        setStudents(studentsRes.data || []);
        setJobs(jobsRes.data || []);
      })
      .catch(() => {
        setStudents([]);
        setJobs([]);
      });
  }, []);

  const submitApplication = async (event) => {
    event.preventDefault();
    await postItem('/applications/apply', {
      StudentID: Number(form.StudentID),
      JobID: Number(form.JobID),
      ApplyDate: form.ApplyDate,
      Status: 'Applied',
    });
    setForm({ StudentID: '', JobID: '', ApplyDate: '' });
    reload();
  };

  const updateStatus = async (id, status) => {
    await patchItem(`/applications/${id}/status`, { Status: status });
    reload();
  };

  return (
    <section className="fade-up">
      <PageHeader title="Applications" description="Students can apply and status can be updated to selected or rejected" />
      <Alert message={error} />

      <div className="ui-card mb-4 grid gap-3 p-4 md:grid-cols-3">
        <input value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Search by student name" className="ui-input" />
        <select value={filters.Status} onChange={(e) => setFilters((p) => ({ ...p, Status: e.target.value }))} className="ui-select">
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="button" onClick={() => setQuery((prev) => ({ ...prev, page: 1 }))} className="ui-btn-primary">Apply Filters</button>
      </div>

      <form onSubmit={submitApplication} className="ui-card mb-4 grid gap-3 p-4 md:grid-cols-4">
        <select required value={form.StudentID} onChange={(e) => setForm((p) => ({ ...p, StudentID: e.target.value }))} className="ui-select">
          <option value="">Select Student</option>
          {students.map((student) => <option key={student.StudentID} value={student.StudentID}>{student.FirstName} {student.LastName}</option>)}
        </select>
        <select required value={form.JobID} onChange={(e) => setForm((p) => ({ ...p, JobID: e.target.value }))} className="ui-select">
          <option value="">Select Job</option>
          {jobs.map((job) => <option key={job.JobID} value={job.JobID}>{job.JobRole} - {job.Company?.CompanyName || 'Company'}</option>)}
        </select>
        <input required type="date" value={form.ApplyDate} onChange={(e) => setForm((p) => ({ ...p, ApplyDate: e.target.value }))} className="ui-input" />
        <button type="submit" className="ui-btn-ink">Apply to Job</button>
      </form>

      <div className="ui-card overflow-x-auto p-3">
        <table className="ui-table">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="ui-th">Student</th>
              <th className="ui-th">Job</th>
              <th className="ui-th">Company</th>
              <th className="ui-th">Status</th>
              <th className="ui-th">Update</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.AppID} className="ui-tr">
                <td className="ui-td font-semibold">{item.Student?.FirstName} {item.Student?.LastName}</td>
                <td className="ui-td">{item.JobPosting?.JobRole || '-'}</td>
                <td className="ui-td">{item.JobPosting?.Company?.CompanyName || '-'}</td>
                <td className="ui-td"><StatusBadge status={item.Status} /></td>
                <td className="ui-td">
                  <select
                    value={item.Status}
                    onChange={(e) => updateStatus(item.AppID, e.target.value)}
                    className="ui-select px-2 py-1 text-xs"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination pagination={pagination} onChange={(nextPage) => setQuery((prev) => ({ ...prev, page: nextPage }))} />
      </div>
    </section>
  );
};

export default ApplicationsPage;
