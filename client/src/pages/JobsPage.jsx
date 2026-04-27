import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import usePaginatedResource from '../hooks/usePaginatedResource';
import useRbacRole from '../hooks/useRbacRole';
import { deleteItem, getList, postItem } from '../services/endpoints';

const JobsPage = () => {
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({ search: '', CompanyID: '' });
  const [form, setForm] = useState({ JobRole: '', Package: '', Eligibility: '', CompanyID: '' });
  const permissions = useRbacRole();

  const fetchJobs = useCallback((query) => getList('/jobs', { ...query, ...filters }), [filters]);
  const { data, pagination, query, setQuery, reload, error } = usePaginatedResource(fetchJobs);

  useEffect(() => {
    getList('/companies', { page: 1, limit: 100 })
      .then((res) => setCompanies(res.data || []))
      .catch(() => setCompanies([]));
  }, []);

  const submitForm = async (event) => {
    event.preventDefault();
    await postItem('/jobs', {
      ...form,
      Package: Number(form.Package),
      CompanyID: Number(form.CompanyID),
    });
    setForm({ JobRole: '', Package: '', Eligibility: '', CompanyID: '' });
    reload();
  };

  const removeJob = async (id) => {
    await deleteItem(`/jobs/${id}`);
    reload();
  };

  return (
    <section className="fade-up">
      <PageHeader title="Job Postings" description="Track open roles from partner companies" />
      <Alert message={error} />

      <div className="ui-card mb-4 grid gap-3 p-4 md:grid-cols-3">
        <input value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Search role or eligibility" className="ui-input" />
        <select value={filters.CompanyID} onChange={(e) => setFilters((p) => ({ ...p, CompanyID: e.target.value }))} className="ui-select">
          <option value="">All Companies</option>
          {companies.map((company) => <option key={company.CompanyID} value={company.CompanyID}>{company.CompanyName}</option>)}
        </select>
        <button type="button" onClick={() => setQuery((prev) => ({ ...prev, page: 1 }))} className="ui-btn-primary">Apply Filters</button>
      </div>

      {permissions.canManage && <form onSubmit={submitForm} className="ui-card mb-4 grid gap-3 p-4 md:grid-cols-4">
        <input required value={form.JobRole} onChange={(e) => setForm((p) => ({ ...p, JobRole: e.target.value }))} placeholder="Job Role" className="ui-input" />
        <input required type="number" value={form.Package} onChange={(e) => setForm((p) => ({ ...p, Package: e.target.value }))} placeholder="Package" className="ui-input" />
        <input required value={form.Eligibility} onChange={(e) => setForm((p) => ({ ...p, Eligibility: e.target.value }))} placeholder="Eligibility" className="ui-input" />
        <select required value={form.CompanyID} onChange={(e) => setForm((p) => ({ ...p, CompanyID: e.target.value }))} className="ui-select">
          <option value="">Select Company</option>
          {companies.map((company) => <option key={company.CompanyID} value={company.CompanyID}>{company.CompanyName}</option>)}
        </select>
        <button type="submit" className="ui-btn-ink">Add Job</button>
      </form>}

      <div className="ui-card overflow-x-auto p-3">
        <table className="ui-table">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="ui-th">Role</th>
              <th className="ui-th">Company</th>
              <th className="ui-th">Package</th>
              <th className="ui-th">Eligibility</th>
              {permissions.canDelete && <th className="ui-th">Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((job) => (
              <tr key={job.JobID} className="ui-tr">
                <td className="ui-td font-semibold">{job.JobRole}</td>
                <td className="ui-td">{job.Company?.CompanyName || '-'}</td>
                <td className="ui-td">{job.Package}</td>
                <td className="ui-td">{job.Eligibility}</td>
                {permissions.canDelete && <td className="ui-td">
                  <button type="button" className="ui-btn-ghost px-3 py-1 text-rose-700" onClick={() => removeJob(job.JobID)}>
                    Delete
                  </button>
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

export default JobsPage;
