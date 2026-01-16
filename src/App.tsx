import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';
import { ProfilePage } from '@/pages/ProfilePage/ProfilePage';
import { ReferenceDashboard } from '@/pages/Reference/ReferenceDashboard';
import { RegionPage } from '@/pages/Reference/RegionPage';
import { DistrictPage } from '@/pages/Reference/DistrictPage';
import { DepartmentPage } from '@/pages/Reference/DepartmentPage';
import { PositionPage } from '@/pages/Reference/PositionPage';
import { EmployeePage } from '@/pages/Staff/EmployeePage';
import UserPermissionsPage from '@/pages/Permissions/UserPermissions';
import PermissionsUserList from '@/pages/Permissions/PermissionsUserList';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';

// Public Route wrapper to redirect authenticated users away from login
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="references">
              <Route index element={<ReferenceDashboard />} />
              {/* ... */}
              <Route path="area/regions" element={<RegionPage />} />
              <Route path="area/districts" element={<DistrictPage />} />
              <Route path="organization/department" element={<DepartmentPage />} />
              <Route path="organization/position" element={<PositionPage />} />
              <Route path="organization/employees" element={<EmployeePage />} />
              <Route path="permissions" element={<PermissionsUserList />} />
              {/* Other reference routes will go here */}
            </Route>
            <Route path="orders" element={<PlaceholderPage title="Buyurtmalar" />} />
            <Route path="content" element={<PlaceholderPage title="Saytga joylashtirish" />} />
            <Route path="price-analysis" element={<PlaceholderPage title="Narx tahlili" />} />
            <Route path="issues" element={<PlaceholderPage title="Murojaat xato" />} />
            <Route path="settings" element={<PlaceholderPage title="Sozlamalar" />} />
            <Route path="permissions/users/:id" element={<UserPermissionsPage />} />
          </Route>
        </Route>

        {/* Catch all redirect to home (which redirects to login if not auth) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
