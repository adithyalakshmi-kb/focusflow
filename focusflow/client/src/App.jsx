import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppStateProvider } from '@/context/AppStateContext';
import { useAuth } from '@/hooks/useAuth';

// Auth Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Protected Pages
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Goals from '@/pages/Goals';
import Habits from '@/pages/Habits';
import Timer from '@/pages/Timer';
import Mood from '@/pages/Mood';
import Profile from '@/pages/Profile';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <PrivateRoute>
            <Layout>
              <Goals />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/habits"
        element={
          <PrivateRoute>
            <Layout>
              <Habits />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/timer"
        element={
          <PrivateRoute>
            <Layout>
              <Timer />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mood"
        element={
          <PrivateRoute>
            <Layout>
              <Mood />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppStateProvider>
          <AppRoutes />
        </AppStateProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
