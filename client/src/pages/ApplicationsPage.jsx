import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import usePaginatedResource from '../hooks/usePaginatedResource';
import useRbacRole from '../hooks/useRbacRole';
import { getList, patchItem, postItem } from '../services/endpoints';

const ApplicationsPage = () => {
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [placedStudentIds, setPlacedStudentIds] = useState(new Set());
  const [filters, setFilters] = useState({ search: '', Status: '' });
  const [form, setForm] = useState({ StudentID: '', JobID: '', ApplyDate: '' });
  const permissions = useRbacRole();
  const { user, isLoaded } = useUser();

  const fetchApplications = useCallback(
    (query) => getList('/applications', { ...query, ...filters }),
    [filters]
  );

  const { data, pagination, query, setQuery, reload, error } = usePaginatedResource(fetchApplications);

  useEffect(() => {
    Promise.all([
      getList('/students', { page: 1, limit: 200 }),
      getList('/jobs', { page: 1, limit: 200 }),
      getList('/placements', { page: 1, limit: 1000 }),
    ])
      .then(([studentsRes, jobsRes, placementsRes]) => {
        setStudents(studentsRes.data || []);
        setJobs(jobsRes.data || []);
        const ids = new Set(
          (placementsRes.data || [])
            .map((placement) => placement?.Application?.StudentID)
            .filter((id) => Number.isInteger(id))
        );
        setPlacedStudentIds(ids);
      })
      .catch(() => {
        setStudents([]);
        setJobs([]);
        setPlacedStudentIds(new Set());
      });
  }, []);

  useEffect(() => {
    if (!permissions.isStudent || !isLoaded) {
      return;
    }

    const email = String(user?.primaryEmailAddress?.emailAddress || '').toLowerCase();
    const matchedStudent = students.find((student) => String(student.Email || '').toLowerCase() === email);

    if (matchedStudent?.StudentID) {
      setForm((prev) => ({ ...prev, StudentID: String(matchedStudent.StudentID) }));
    }
  }, [isLoaded, permissions.isStudent, students, user]);

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

  const selectedStudentId = form.StudentID ? Number(form.StudentID) : null;
  const isSelectedStudentPlaced = selectedStudentId !== null && placedStudentIds.has(selectedStudentId);

  return (
    <section className="fade-up">
      <PageHeader title="Applications" description="Students can apply and status can be updated to selected or rejected" />
      <Alert message={error} />

      <div className="ui-card mb-4 grid gap-3 p-4 md:grid-cols-3">
        <input value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Search by IDs, student name, job role, or company" className="ui-input" />
        <select value={filters.Status} onChange={(e) => setFilters((p) => ({ ...p, Status: e.target.value }))} className="ui-select">
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="button" onClick={() => setQuery((prev) => ({ ...prev, page: 1 }))} className="ui-btn-primary">Apply Filters</button>
      </div>

      <form onSubmit={submitApplication} className="ui-card mb-4 grid gap-3 p-4 md:grid-cols-4">
        <select required disabled={!permissions.canManage} value={form.StudentID} onChange={(e) => setForm((p) => ({ ...p, StudentID: e.target.value }))} className="ui-select">
          <option value="">Select Student</option>
          {students.map((student) => (
            <option key={student.StudentID} value={student.StudentID} disabled={placedStudentIds.has(student.StudentID)}>
              {student.FirstName} {student.LastName}{placedStudentIds.has(student.StudentID) ? ' (Placed)' : ''}
            </option>
          ))}
        </select>
        <select required value={form.JobID} onChange={(e) => setForm((p) => ({ ...p, JobID: e.target.value }))} className="ui-select">
          <option value="">Select Job</option>
          {jobs.map((job) => <option key={job.JobID} value={job.JobID}>{job.JobRole} - {job.Company?.CompanyName || 'Company'}</option>)}
        </select>
        <input required type="date" value={form.ApplyDate} onChange={(e) => setForm((p) => ({ ...p, ApplyDate: e.target.value }))} className="ui-input" />
        <button type="submit" className="ui-btn-ink" disabled={(!permissions.canManage && !permissions.isStudent) || isSelectedStudentPlaced}>
          Apply to Job
        </button>
      </form>
      {isSelectedStudentPlaced && <p className="mb-4 text-sm font-medium text-rose-700">This student is already placed. New applications are locked.</p>}

      <div className="ui-card overflow-x-auto p-3">
        <table className="ui-table">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="ui-th">Student</th>
              <th className="ui-th">Job</th>
              <th className="ui-th">Company</th>
              <th className="ui-th">Status</th>
              {permissions.canManage && <th className="ui-th">Update</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.AppID} className="ui-tr">
                <td className="ui-td font-semibold">{item.Student?.FirstName} {item.Student?.LastName}</td>
                <td className="ui-td">{item.JobPosting?.JobRole || '-'}</td>
                <td className="ui-td">{item.JobPosting?.Company?.CompanyName || '-'}</td>
                <td className="ui-td"><StatusBadge status={item.Status} /></td>
                {permissions.canManage && <td className="ui-td">
                  <select
                    value={item.Status}
                    onChange={(e) => updateStatus(item.AppID, e.target.value)}
                    className="ui-select px-2 py-1 text-xs"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>}
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
