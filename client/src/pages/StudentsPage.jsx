import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import usePaginatedResource from '../hooks/usePaginatedResource';
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

      <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
        <input
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          placeholder="Search by name or email"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={filters.DeptID}
          onChange={(e) => setFilters((prev) => ({ ...prev, DeptID: e.target.value }))}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
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
          className="rounded-md bg-ocean px-4 py-2 text-sm font-semibold text-white"
        >
          Apply Filters
        </button>
      </div>

      <form onSubmit={submitForm} className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <input required value={form.FirstName} onChange={(e) => setForm((p) => ({ ...p, FirstName: e.target.value }))} placeholder="First Name" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input required value={form.LastName} onChange={(e) => setForm((p) => ({ ...p, LastName: e.target.value }))} placeholder="Last Name" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input required type="date" value={form.DOB} onChange={(e) => setForm((p) => ({ ...p, DOB: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <select value={form.Gender} onChange={(e) => setForm((p) => ({ ...p, Gender: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm"><option value="M">Male</option><option value="F">Female</option></select>
        <input value={form.Phone} onChange={(e) => setForm((p) => ({ ...p, Phone: e.target.value }))} placeholder="Phone" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input type="email" value={form.Email} onChange={(e) => setForm((p) => ({ ...p, Email: e.target.value }))} placeholder="Email" className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <select value={form.DeptID} onChange={(e) => setForm((p) => ({ ...p, DeptID: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.DeptID} value={dept.DeptID}>{dept.DeptName}</option>
          ))}
        </select>
        <button type="submit" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Add Student</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Department</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">Phone</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.StudentID} className="border-b border-slate-100">
                <td className="px-2 py-2">{item.FirstName} {item.LastName}</td>
                <td className="px-2 py-2">{item.Department?.DeptName || '-'}</td>
                <td className="px-2 py-2">{item.Email || '-'}</td>
                <td className="px-2 py-2">{item.Phone || '-'}</td>
                <td className="px-2 py-2">
                  <button type="button" className="text-rose-600" onClick={() => removeStudent(item.StudentID)}>Delete</button>
                </td>
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
