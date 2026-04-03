import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { login, logout } from './store/authSlice';
import { supabase } from './services/supabase/supabase';
import { ensureCurrentUserProfile } from './services/leads';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddLeadPage from './pages/AddLeadPage';
import LeadDetailsPage from './pages/LeadDetailsPage';
import ProfilePage from './pages/ProfilePage';

function PrivateRoute({ children, ready }: { children: React.ReactNode; ready: boolean }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
        <p className="text-sm text-text-secondary">Checking session...</p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  const dispatch = useAppDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const syncAuthFromSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error || !data.session?.user) {
        dispatch(logout());
        setAuthReady(true);
        return;
      }

      const user = data.session.user;
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      await ensureCurrentUserProfile();

      dispatch(login({
        id: user.id,
        name,
        email: user.email || '',
      }));
      setAuthReady(true);
    };

    void syncAuthFromSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) {
        return;
      }

      if (!session?.user) {
        dispatch(logout());
        setAuthReady(true);
        return;
      }

      const user = session.user;
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      void ensureCurrentUserProfile();

      dispatch(login({
        id: user.id,
        name,
        email: user.email || '',
      }));
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute ready={authReady}>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-lead"
          element={
            <PrivateRoute ready={authReady}>
              <AddLeadPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/lead/:id"
          element={
            <PrivateRoute ready={authReady}>
              <LeadDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute ready={authReady}>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
