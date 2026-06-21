import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0px',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '3px',
        cursor: 'pointer',
        position: 'relative',
        height: '32px',
        width: '60px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}
    >
      {/* Sliding indicator knob */}
      <div
        style={{
          position: 'absolute',
          top: '3px',
          left: theme === 'dark' ? '31px' : '3px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 8px rgba(170, 59, 255, 0.3)',
          zIndex: 1
        }}
      />
      
      {/* Sun Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        zIndex: 2,
        color: theme === 'light' ? '#ffffff' : 'var(--text-secondary)',
        transition: 'color 0.3s ease'
      }}>
        <Sun size={14} />
      </div>

      {/* Moon Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        zIndex: 2,
        color: theme === 'dark' ? '#ffffff' : 'var(--text-secondary)',
        transition: 'color 0.3s ease'
      }}>
        <Moon size={14} />
      </div>
    </button>
  );
};

export default ThemeToggle;
