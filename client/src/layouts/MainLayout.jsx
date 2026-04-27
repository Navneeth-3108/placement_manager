import { useState } from 'react';
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { setApiAuthContext } from '../services/api';
import useRbacRole from '../hooks/useRbacRole';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const permissions = useRbacRole();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const primaryEmailAddress = user?.primaryEmailAddress?.emailAddress || '';

    setApiAuthContext({
      userId: user?.id || '',
      emailAddress: primaryEmailAddress,
      role: permissions.role,
    });
  }, [isLoaded, permissions.role, user]);

  return (
    <div className="min-h-screen bg-transparent lg:pl-64">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} permissions={permissions} />

      <main className="p-4 lg:p-8">
        <div className="container-app">
          <Navbar onMenuClick={() => setSidebarOpen(true)} role={permissions.role} />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
