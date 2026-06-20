import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, User, LogOut, FileText, LayoutDashboard, PlusCircle, CheckSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="main-nav" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--card-bg)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="https://files.catbox.moe/u7j575.png" 
          alt="Campus Voice Logo" 
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            objectFit: 'cover'
          }} 
        />
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-h)', display: 'block', fontSize: '16px', lineHeight: 1.2 }}>
            Campus Voice
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Campus Complaint Management
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="nav-links">
        {user.role === 'student' ? (
          <>
            <Link
              to="/student/dashboard"
              className={`nav-link ${isActive('/student/dashboard') ? 'active' : ''}`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/student/complaints"
              className={`nav-link ${isActive('/student/complaints') ? 'active' : ''}`}
            >
              <FileText size={16} />
              <span>My Complaints</span>
            </Link>
            <Link
              to="/student/submit"
              className={`nav-link submit-btn-link ${isActive('/student/submit') ? 'active' : ''}`}
            >
              <PlusCircle size={16} />
              <span>File Complaint</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/admin/dashboard"
              className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/complaints"
              className={`nav-link ${isActive('/admin/complaints') ? 'active' : ''}`}
            >
              <CheckSquare size={16} />
              <span>Manage Complaints</span>
            </Link>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="user-badge-container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'var(--accent-bg)',
            color: user.role === 'admin' ? '#ef4444' : 'var(--accent)',
            border: `1px solid ${user.role === 'admin' ? '#ef444430' : 'var(--accent-border)'}`
          }}>
            {user.role === 'admin' ? <Shield size={18} /> : <User size={18} />}
          </div>
          <div style={{ textAlign: 'left' }} className="user-info">
            <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-h)', display: 'block' }}>
              {user.name}
            </span>
            <span className={`role-badge ${user.role}`}>
              {user.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="logout-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
        >
          <LogOut size={14} />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
