import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import usePaginatedResource from '../hooks/usePaginatedResource';
import { deleteItem, getList, postItem } from '../services/endpoints';

const JobsPage = () => {
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({ search: '', CompanyID: '' });
  const [form, setForm] = useState({ JobRole: '', Package: '', Eligibility: '', CompanyID: '' });

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

      <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <input value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Search role or eligibility" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <select value={filters.CompanyID} onChange={(e) => setFilters((p) => ({ ...p, CompanyID: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All Companies</option>
          {companies.map((company) => <option key={company.CompanyID} value={company.CompanyID}>{company.CompanyName}</option>)}
        </select>
        <button type="button" onClick={() => setQuery((prev) => ({ ...prev, page: 1 }))} className="rounded-md bg-ocean px-4 py-2 text-sm font-semibold text-white">Apply Filters</button>
      </div>

      <form onSubmit={submitForm} className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <input required value={form.JobRole} onChange={(e) => setForm((p) => ({ ...p, JobRole: e.target.value }))} placeholder="Job Role" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input required type="number" value={form.Package} onChange={(e) => setForm((p) => ({ ...p, Package: e.target.value }))} placeholder="Package" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input required value={form.Eligibility} onChange={(e) => setForm((p) => ({ ...p, Eligibility: e.target.value }))} placeholder="Eligibility" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <select required value={form.CompanyID} onChange={(e) => setForm((p) => ({ ...p, CompanyID: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select Company</option>
          {companies.map((company) => <option key={company.CompanyID} value={company.CompanyID}>{company.CompanyName}</option>)}
        </select>
        <button type="submit" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Add Job</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-2 py-2">Role</th>
              <th className="px-2 py-2">Company</th>
              <th className="px-2 py-2">Package</th>
              <th className="px-2 py-2">Eligibility</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((job) => (
              <tr key={job.JobID} className="border-b border-slate-100">
                <td className="px-2 py-2">{job.JobRole}</td>
                <td className="px-2 py-2">{job.Company?.CompanyName || '-'}</td>
                <td className="px-2 py-2">{job.Package}</td>
                <td className="px-2 py-2">{job.Eligibility}</td>
                <td className="px-2 py-2"><button type="button" className="text-rose-600" onClick={() => removeJob(job.JobID)}>Delete</button></td>
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
