import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { LeadsPage } from '@/pages/LeadsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App() {
  const initialize = useAuthStore((s) => s.initialize);
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === 'idle') {
      void initialize();
    }
  }, [status, initialize]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<LeadsPage />} />
          <Route path="/leads" element={<Navigate to="/" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
