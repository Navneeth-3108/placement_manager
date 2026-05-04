import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import Pagination from '../components/Pagination';
import usePaginatedResource from '../hooks/usePaginatedResource';
import useRbacRole from '../hooks/useRbacRole';
import { getList, postItem } from '../services/endpoints';

const PlacementsPage = () => {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({ AppID: '', OfferDate: '', JoiningDate: '' });
  const permissions = useRbacRole();

  const fetchPlacements = useCallback((query) => getList('/placements', query), []);
  const { data, pagination, query, setQuery, reload, error } = usePaginatedResource(fetchPlacements);

  useEffect(() => {
    getList('/applications', { page: 1, limit: 200, Status: 'Selected', unplaced: true })
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

      {permissions.canManage && <form onSubmit={submitPlacement} className="ui-card mb-4 grid gap-3 p-4 md:grid-cols-4">
        <select required value={form.AppID} onChange={(e) => setForm((p) => ({ ...p, AppID: e.target.value }))} className="ui-select">
          <option value="">Select Selected Application</option>
          {applications.map((app) => (
            <option key={app.AppID} value={app.AppID}>
              {app.Student?.FirstName} {app.Student?.LastName} - {app.JobPosting?.JobRole}
            </option>
          ))}
        </select>
        <input required type="date" value={form.OfferDate} onChange={(e) => setForm((p) => ({ ...p, OfferDate: e.target.value }))} className="ui-input" />
        <input required type="date" value={form.JoiningDate} onChange={(e) => setForm((p) => ({ ...p, JoiningDate: e.target.value }))} className="ui-input" />
        <button type="submit" className="ui-btn-ink">Create Placement</button>
      </form>}

      <div className="ui-card overflow-x-auto p-3">
        <table className="ui-table">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="ui-th">Student</th>
              <th className="ui-th">Job</th>
              <th className="ui-th">Company</th>
              <th className="ui-th">Offer Date</th>
              <th className="ui-th">Joining Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((placement) => (
              <tr key={placement.PlaceID} className="ui-tr">
                <td className="ui-td font-semibold">
                  {placement.Application?.Student?.FirstName} {placement.Application?.Student?.LastName}
                </td>
                <td className="ui-td">{placement.Application?.JobPosting?.JobRole || '-'}</td>
                <td className="ui-td">{placement.Application?.JobPosting?.Company?.CompanyName || '-'}</td>
                <td className="ui-td">{placement.OfferDate}</td>
                <td className="ui-td">{placement.JoiningDate}</td>
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
