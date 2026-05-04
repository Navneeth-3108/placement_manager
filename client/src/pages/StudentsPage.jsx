import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import usePaginatedResource from '../hooks/usePaginatedResource';
import useRbacRole from '../hooks/useRbacRole';
import { deleteItem, getList, postItem } from '../services/endpoints';

const StudentsPage = () => {
  const [form, setForm] = useState({
    FirstName: '',
    LastName: '',
    DOB: '',
    Gender: 'M',
    Phone: '',
    Email: '',
    DeptID: '',
  });
  const [filters, setFilters] = useState({ search: '', DeptID: '' });
  const [departments, setDepartments] = useState([]);
  const permissions = useRbacRole();

  const fetchStudents = useCallback(
    (query) => getList('/students', { ...query, ...filters }),
    [filters]
  );

  const { data, pagination, query, setQuery, reload, error } = usePaginatedResource(fetchStudents);

  useEffect(() => {
    const loadDepartments = async () => {
      const response = await getList('/departments', { page: 1, limit: 100 });
      setDepartments(response.data || []);
    };

    loadDepartments().catch(() => setDepartments([]));
  }, []);

  const submitForm = async (event) => {
    event.preventDefault();
    await postItem('/students', {
      ...form,
      DeptID: form.DeptID ? Number(form.DeptID) : null,
      Phone: form.Phone || null,
      Email: form.Email || null,
    });
    setForm({ FirstName: '', LastName: '', DOB: '', Gender: 'M', Phone: '', Email: '', DeptID: '' });
    reload();
  };

  const removeStudent = async (id) => {
    await deleteItem(`/students/${id}`);
    reload();
  };

  return (
    <section className="fade-up">
      <PageHeader title="Students" description="Manage student records with department-based filtering" />

      <Alert message={error} />

      <div className="ui-card mb-4 grid gap-3 p-4 md:grid-cols-3">
        <input
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          placeholder="Search by Student ID, name, or email"
          className="ui-input"
        />
        <select
          value={filters.DeptID}
          onChange={(e) => setFilters((prev) => ({ ...prev, DeptID: e.target.value }))}
          className="ui-select"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.DeptID} value={dept.DeptID}>
              {dept.DeptName}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setQuery((prev) => ({ ...prev, page: 1 }))}
          className="ui-btn-primary"
        >
          Apply Filters
        </button>
      </div>

      {permissions.canManage && <form onSubmit={submitForm} className="ui-card mb-4 grid gap-3 p-4 md:grid-cols-4">
        <input required value={form.FirstName} onChange={(e) => setForm((p) => ({ ...p, FirstName: e.target.value }))} placeholder="First Name" className="ui-input" />
        <input required value={form.LastName} onChange={(e) => setForm((p) => ({ ...p, LastName: e.target.value }))} placeholder="Last Name" className="ui-input" />
        <input required type="date" value={form.DOB} onChange={(e) => setForm((p) => ({ ...p, DOB: e.target.value }))} className="ui-input" />
        <select value={form.Gender} onChange={(e) => setForm((p) => ({ ...p, Gender: e.target.value }))} className="ui-select"><option value="M">Male</option><option value="F">Female</option></select>
        <input value={form.Phone} onChange={(e) => setForm((p) => ({ ...p, Phone: e.target.value }))} placeholder="Phone" className="ui-input" />
        <input type="email" value={form.Email} onChange={(e) => setForm((p) => ({ ...p, Email: e.target.value }))} placeholder="Email" className="ui-input" />
        <select value={form.DeptID} onChange={(e) => setForm((p) => ({ ...p, DeptID: e.target.value }))} className="ui-select">
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.DeptID} value={dept.DeptID}>{dept.DeptName}</option>
          ))}
        </select>
        <button type="submit" className="ui-btn-ink">Add Student</button>
      </form>}

      <div className="ui-card overflow-x-auto p-3">
        <table className="ui-table">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="ui-th">Name</th>
              <th className="ui-th">Department</th>
              <th className="ui-th">Email</th>
              <th className="ui-th">Phone</th>
              {permissions.canDelete && <th className="ui-th">Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.StudentID} className="ui-tr">
                <td className="ui-td font-semibold">{item.FirstName} {item.LastName}</td>
                <td className="ui-td">{item.Department?.DeptName || '-'}</td>
                <td className="ui-td">{item.Email || '-'}</td>
                <td className="ui-td">{item.Phone || '-'}</td>
                {permissions.canDelete && <td className="ui-td">
                  <button type="button" className="ui-btn-ghost px-3 py-1 text-rose-700" onClick={() => removeStudent(item.StudentID)}>Delete</button>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          pagination={pagination}
          onChange={(nextPage) => setQuery((prev) => ({ ...prev, page: nextPage }))}
        />
      </div>
    </section>
  );
};

export default StudentsPage;
