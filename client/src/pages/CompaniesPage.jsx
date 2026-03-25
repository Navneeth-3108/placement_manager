import { useCallback, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import usePaginatedResource from '../hooks/usePaginatedResource';
import { deleteItem, getList, postItem } from '../services/endpoints';

const CompaniesPage = () => {
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ CompanyName: '', Industry: '', Location: '' });

  const fetchCompanies = useCallback((query) => getList('/companies', { ...query, search }), [search]);

  const { data, pagination, query, setQuery, reload, error } = usePaginatedResource(fetchCompanies);

  const submitForm = async (event) => {
    event.preventDefault();
    await postItem('/companies', form);
    setForm({ CompanyName: '', Industry: '', Location: '' });
    reload();
  };

  const removeCompany = async (id) => {
    await deleteItem(`/companies/${id}`);
    reload();
  };

  return (
    <section className="fade-up">
      <PageHeader title="Companies" description="Manage recruiting organizations" />
      <Alert message={error} />

      <div className="mb-4 flex gap-2 rounded-xl border border-slate-200 bg-white p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <button type="button" onClick={() => setQuery((prev) => ({ ...prev, page: 1 }))} className="rounded-md bg-ocean px-4 py-2 text-sm font-semibold text-white">Search</button>
      </div>

      <form onSubmit={submitForm} className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <input required value={form.CompanyName} onChange={(e) => setForm((p) => ({ ...p, CompanyName: e.target.value }))} placeholder="Company Name" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input required value={form.Industry} onChange={(e) => setForm((p) => ({ ...p, Industry: e.target.value }))} placeholder="Industry" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input value={form.Location} onChange={(e) => setForm((p) => ({ ...p, Location: e.target.value }))} placeholder="Location" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <button type="submit" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Add Company</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Industry</th>
              <th className="px-2 py-2">Location</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((company) => (
              <tr key={company.CompanyID} className="border-b border-slate-100">
                <td className="px-2 py-2">{company.CompanyName}</td>
                <td className="px-2 py-2">{company.Industry}</td>
                <td className="px-2 py-2">{company.Location || '-'}</td>
                <td className="px-2 py-2"><button type="button" className="text-rose-600" onClick={() => removeCompany(company.CompanyID)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination pagination={pagination} onChange={(nextPage) => setQuery((prev) => ({ ...prev, page: nextPage }))} />
      </div>
    </section>
  );
};

export default CompaniesPage;
