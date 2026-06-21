import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import SubmitComplaint from './pages/student/SubmitComplaint';
import MyComplaints from './pages/student/MyComplaints';
import AdminDashboard from './pages/admin/Dashboard';
import AdminComplaints from './pages/admin/AdminComplaints';

// ProtectedRoute Wrapper for role management
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: 'student' | 'admin' }> = ({
  children,
  allowedRole,
}) => {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    // Redirect to login if unauthenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to respective dashboard if role mismatch
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }

  return <>{children}</>;
};

// Route Redirector based on user role when hitting root "/" or "/login" while authenticated
const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useApp();

  return (
    <Router>
      {user ? (
        <Navbar />
      ) : (
        <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 1000 }}>
          <ThemeToggle />
        </div>
      )}
      <div style={{ flexGrow: 1 }} className="main-content-wrapper">
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/submit"
            element={
              <ProtectedRoute allowedRole="student">
                <SubmitComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/complaints"
            element={
              <ProtectedRoute allowedRole="student">
                <MyComplaints />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminComplaints />
              </ProtectedRoute>
            }
          />

          {/* Welcome/Landing Route */}
          <Route path="/" element={<Welcome />} />

          {/* Fallback Catch-all Route */}
          <Route
            path="*"
            element={
              <Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard') : '/'} replace />
            }
          />
        </Routes>
      </div>
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid var(--border)',
        fontSize: '12.5px',
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--card-bg)'
      }}>
        © {new Date().getFullYear()} Campus Voice. All rights reserved.
      </footer>
    </Router>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
