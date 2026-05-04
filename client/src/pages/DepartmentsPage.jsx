import { useEffect, useState, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import usePaginatedResource from '../hooks/usePaginatedResource';
import useRbacRole from '../hooks/useRbacRole';
import { deleteItem, getList, postItem } from '../services/endpoints';

const DepartmentsPage = () => {
  const [form, setForm] = useState({ DeptName: '', HOD: '' });
  const [search, setSearch] = useState('');
  const permissions = useRbacRole();

  const fetchDepartments = useCallback((query) => getList('/departments', { ...query, search }), [search]);
  const { data, pagination, query, setQuery, reload, error } = usePaginatedResource(fetchDepartments);

  const submitForm = async (e) => {
    e.preventDefault();
    await postItem('/departments', form);
    setForm({ DeptName: '', HOD: '' });
    reload();
  };

  const removeDept = async (id) => {
    await deleteItem(`/departments/${id}`);
    reload();
  };

  useEffect(() => {
    // ensure initial load
    setQuery((p) => ({ ...p, page: 1 }));
  }, [setQuery]);

  return (
    <section className="fade-up">
      <PageHeader title="Departments" description="Manage academic departments" />

      <Alert message={error} />

      <div className="ui-card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Department ID or name"
          className="ui-input"
        />
        <button
          type="button"
          onClick={() => setQuery((p) => ({ ...p, page: 1 }))}
          className="ui-btn-primary"
        >
          Search
        </button>
      </div>

      {permissions.canManage && (
        <form onSubmit={submitForm} className="ui-card mb-4 grid gap-3 p-4 md:grid-cols-3">
          <input required value={form.DeptName} onChange={(e) => setForm((p) => ({ ...p, DeptName: e.target.value }))} placeholder="Department Name" className="ui-input" />
          <input required value={form.HOD} onChange={(e) => setForm((p) => ({ ...p, HOD: e.target.value }))} placeholder="HOD" className="ui-input" />
          <button type="submit" className="ui-btn-ink">Add Department</button>
        </form>
      )}

      <div className="ui-card overflow-x-auto p-3">
        <table className="ui-table">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="ui-th">Name</th>
              <th className="ui-th">HOD</th>
              {permissions.canDelete && <th className="ui-th">Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.DeptID} className="ui-tr">
                <td className="ui-td font-semibold">{item.DeptName}</td>
                <td className="ui-td">{item.HOD}</td>
                {permissions.canDelete && (
                  <td className="ui-td">
                    <button type="button" className="ui-btn-ghost px-3 py-1 text-rose-700" onClick={() => removeDept(item.DeptID)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination pagination={pagination} onChange={(next) => setQuery((p) => ({ ...p, page: next }))} />
      </div>
    </section>
  );
};

export default DepartmentsPage;
