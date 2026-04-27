import { useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';

const ADMIN_EMAIL = String(import.meta.env.VITE_RBAC_ADMIN_EMAIL || '24z218@psgtech.ac.in').toLowerCase();

const useRbacRole = () => {
  const { user, isLoaded } = useUser();

  return useMemo(() => {
    if (!isLoaded) {
      return {
        isLoaded,
        role: 'student',
        isAdmin: false,
        isOfficer: false,
        isStudent: true,
        canManage: false,
        canDelete: false,
        canViewDashboard: false,
      };
    }

    const email = String(user?.primaryEmailAddress?.emailAddress || '').toLowerCase();
    const role = email === ADMIN_EMAIL ? 'admin' : 'student';
    const isAdmin = role === 'admin';
    const isOfficer = role === 'officer';
    const isStudent = role === 'student';

    return {
      isLoaded,
      role,
      isAdmin,
      isOfficer,
      isStudent,
      canManage: isAdmin || isOfficer,
      canDelete: isAdmin,
      canViewDashboard: isAdmin || isOfficer,
    };
  }, [isLoaded, user]);
};

export default useRbacRole;
