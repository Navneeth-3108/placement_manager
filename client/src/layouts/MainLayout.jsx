import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent lg:pl-64">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="p-4 lg:p-8">
        <div className="container-app">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
