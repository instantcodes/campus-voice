import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogIn, User, Shield, Info } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    const errorMsg = await login(email, password, role);
    if (!errorMsg) {
      if (role === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      setError(errorMsg);
    }
  };

  return (
    <div className="auth-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100svh - 40px)',
      padding: '20px',
      backgroundColor: 'var(--bg)'
    }}>
      <div className="auth-card" style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '40px 32px',
        boxShadow: 'var(--shadow)',
        textAlign: 'center'
      }}>
        {/* Logo/Header */}
        <div style={{ marginBottom: '32px' }}>
          <img 
            src="https://files.catbox.moe/u7j575.png" 
            alt="Campus Voice Logo" 
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              marginBottom: '16px',
              boxShadow: '0 8px 16px rgba(170, 59, 255, 0.2)',
              objectFit: 'cover'
            }} 
          />
          <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-h)' }}>
            Welcome back
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', margin: 0 }}>
            Log in to Campus Voice to manage or submit complaints
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: 'var(--code-bg)',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            className={`role-tab ${role === 'student' ? 'active' : ''}`}
            onClick={() => setRole('student')}
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: role === 'student' ? 'var(--card-bg)' : 'transparent',
              color: role === 'student' ? 'var(--text-h)' : 'var(--text-secondary)',
              boxShadow: role === 'student' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <User size={16} />
            Student
          </button>
          <button
            type="button"
            className={`role-tab ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: role === 'admin' ? 'var(--card-bg)' : 'transparent',
              color: role === 'admin' ? 'var(--text-h)' : 'var(--text-secondary)',
              boxShadow: role === 'admin' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Shield size={16} />
            Administrator
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="error-alert" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '13.5px',
            textAlign: 'left',
            marginBottom: '20px'
          }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-h)', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'student' ? 'e.g., Student@gmail.com' : 'e.g., Adim@gmail.com'}
              className="form-input"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text-h)',
                fontSize: '14.5px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-h)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text-h)',
                fontSize: '14.5px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            style={{
              marginTop: '10px',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'var(--accent)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 12px rgba(170, 59, 255, 0.15)'
            }}
          >
            <LogIn size={16} />
            Sign In as {role === 'student' ? 'Student' : 'Admin'}
          </button>
        </form>

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Create an account</Link>
          </p>
        </div>


      </div>
    </div>
  );
};
export default Login;
