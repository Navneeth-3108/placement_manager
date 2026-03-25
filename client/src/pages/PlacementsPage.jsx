import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import usePaginatedResource from '../hooks/usePaginatedResource';
import { getList, postItem } from '../services/endpoints';

const PlacementsPage = () => {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({ AppID: '', OfferDate: '', JoiningDate: '' });

  const fetchPlacements = useCallback((query) => getList('/placements', query), []);
  const { data, pagination, query, setQuery, reload, error } = usePaginatedResource(fetchPlacements);

  useEffect(() => {
    getList('/applications', { page: 1, limit: 200, Status: 'Selected' })
      .then((res) => setApplications(res.data || []))
      .catch(() => setApplications([]));
  }, [reload]);

  const submitPlacement = async (event) => {
    event.preventDefault();
    await postItem('/placements', {
      AppID: Number(form.AppID),
      OfferDate: form.OfferDate,
      JoiningDate: form.JoiningDate,
    });
    setForm({ AppID: '', OfferDate: '', JoiningDate: '' });
    reload();
  };

  return (
    <section className="fade-up">
      <PageHeader title="Placements" description="Create final placement records only for selected applications" />
      <Alert message={error} />

      <form onSubmit={submitPlacement} className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <select required value={form.AppID} onChange={(e) => setForm((p) => ({ ...p, AppID: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select Selected Application</option>
          {applications.map((app) => (
            <option key={app.AppID} value={app.AppID}>
              {app.Student?.FirstName} {app.Student?.LastName} - {app.JobPosting?.JobRole}
            </option>
          ))}
        </select>
        <input required type="date" value={form.OfferDate} onChange={(e) => setForm((p) => ({ ...p, OfferDate: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input required type="date" value={form.JoiningDate} onChange={(e) => setForm((p) => ({ ...p, JoiningDate: e.target.value }))} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <button type="submit" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Create Placement</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-2 py-2">Student</th>
              <th className="px-2 py-2">Job</th>
              <th className="px-2 py-2">Company</th>
              <th className="px-2 py-2">Offer Date</th>
              <th className="px-2 py-2">Joining Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((placement) => (
              <tr key={placement.PlaceID} className="border-b border-slate-100">
                <td className="px-2 py-2">
                  {placement.Application?.Student?.FirstName} {placement.Application?.Student?.LastName}
                </td>
                <td className="px-2 py-2">{placement.Application?.JobPosting?.JobRole || '-'}</td>
                <td className="px-2 py-2">{placement.Application?.JobPosting?.Company?.CompanyName || '-'}</td>
                <td className="px-2 py-2">{placement.OfferDate}</td>
                <td className="px-2 py-2">{placement.JoiningDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination pagination={pagination} onChange={(nextPage) => setQuery((prev) => ({ ...prev, page: nextPage }))} />
      </div>
    </section>
  );
};

export default PlacementsPage;
