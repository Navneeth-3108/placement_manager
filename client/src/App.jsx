import { Navigate, Route, Routes } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import CompaniesPage from './pages/CompaniesPage';
import JobsPage from './pages/JobsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import PlacementsPage from './pages/PlacementsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import SignInPage from './pages/SignInPage';
import useRbacRole from './hooks/useRbacRole';

const App = () => {
  const permissions = useRbacRole();

  return (
    <Routes>
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route
        element={
          <>
            <SignedIn>
              <MainLayout />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
          </>
        }
      >
        <Route path="/" element={permissions.canViewDashboard ? <DashboardPage /> : <Navigate to="/applications" replace />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/placements" element={<PlacementsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
