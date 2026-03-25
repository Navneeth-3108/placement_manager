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

      <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <input value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Search by student name" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <select value={filters.Status} onChange={(e) => setFilters((p) => ({ ...p, Status: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="button" onClick={() => setQuery((prev) => ({ ...prev, page: 1 }))} className="rounded-md bg-ocean px-4 py-2 text-sm font-semibold text-white">Apply Filters</button>
      </div>

      <form onSubmit={submitApplication} className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <select required value={form.StudentID} onChange={(e) => setForm((p) => ({ ...p, StudentID: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select Student</option>
          {students.map((student) => <option key={student.StudentID} value={student.StudentID}>{student.FirstName} {student.LastName}</option>)}
        </select>
        <select required value={form.JobID} onChange={(e) => setForm((p) => ({ ...p, JobID: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select Job</option>
          {jobs.map((job) => <option key={job.JobID} value={job.JobID}>{job.JobRole} - {job.Company?.CompanyName || 'Company'}</option>)}
        </select>
        <input required type="date" value={form.ApplyDate} onChange={(e) => setForm((p) => ({ ...p, ApplyDate: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <button type="submit" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Apply to Job</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-2 py-2">Student</th>
              <th className="px-2 py-2">Job</th>
              <th className="px-2 py-2">Company</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Update</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.AppID} className="border-b border-slate-100">
                <td className="px-2 py-2">{item.Student?.FirstName} {item.Student?.LastName}</td>
                <td className="px-2 py-2">{item.JobPosting?.JobRole || '-'}</td>
                <td className="px-2 py-2">{item.JobPosting?.Company?.CompanyName || '-'}</td>
                <td className="px-2 py-2"><StatusBadge status={item.Status} /></td>
                <td className="px-2 py-2">
                  <select
                    value={item.Status}
                    onChange={(e) => updateStatus(item.AppID, e.target.value)}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs"
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
