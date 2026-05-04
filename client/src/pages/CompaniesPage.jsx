import { useCallback, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import usePaginatedResource from '../hooks/usePaginatedResource';
import useRbacRole from '../hooks/useRbacRole';
import { deleteItem, getList, postItem } from '../services/endpoints';

const CompaniesPage = () => {
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ CompanyName: '', Industry: '', Location: '' });
  const permissions = useRbacRole();

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

      <div className="ui-card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Company ID or name"
          className="ui-input"
        />
        <button
          type="button"
          onClick={() => setQuery((prev) => ({ ...prev, page: 1 }))}
          className="ui-btn-primary"
        >
          Search
        </button>
      </div>

      {permissions.canManage && <form onSubmit={submitForm} className="ui-card mb-4 grid gap-3 p-4 md:grid-cols-4">
        <input required value={form.CompanyName} onChange={(e) => setForm((p) => ({ ...p, CompanyName: e.target.value }))} placeholder="Company Name" className="ui-input" />
        <input required value={form.Industry} onChange={(e) => setForm((p) => ({ ...p, Industry: e.target.value }))} placeholder="Industry" className="ui-input" />
        <input value={form.Location} onChange={(e) => setForm((p) => ({ ...p, Location: e.target.value }))} placeholder="Location" className="ui-input" />
        <button type="submit" className="ui-btn-ink">Add Company</button>
      </form>}

      <div className="ui-card overflow-x-auto p-3">
        <table className="ui-table">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="ui-th">Name</th>
              <th className="ui-th">Industry</th>
              <th className="ui-th">Location</th>
              {permissions.canDelete && <th className="ui-th">Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((company) => (
              <tr key={company.CompanyID} className="ui-tr">
                <td className="ui-td font-semibold">{company.CompanyName}</td>
                <td className="ui-td">{company.Industry}</td>
                <td className="ui-td">{company.Location || '-'}</td>
                {permissions.canDelete && <td className="ui-td">
                  <button type="button" className="ui-btn-ghost px-3 py-1 text-rose-700" onClick={() => removeCompany(company.CompanyID)}>
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

export default CompaniesPage;
