import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen lg:pl-64">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="p-4 lg:p-6">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
