import { useEffect, useState } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import Alert from '../components/Alert';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data.data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard stats');
      }
    };

    loadStats();
  }, []);

  return (
    <section>
      <PageHeader
        title="Dashboard"
        description="Real-time overview of hiring, applications, and final placements"
      />

      <Alert message={error} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Students" value={stats?.students ?? '-'} tone="ocean" />
        <StatCard title="Companies" value={stats?.companies ?? '-'} tone="coral" />
        <StatCard title="Jobs" value={stats?.jobs ?? '-'} tone="ink" />
        <StatCard title="Applications" value={stats?.applications ?? '-'} tone="ocean" />
        <StatCard title="Selected" value={stats?.selected ?? '-'} tone="fern" />
        <StatCard title="Placements" value={stats?.placements ?? '-'} tone="coral" />
      </div>
    </section>
  );
};

export default DashboardPage;
