import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  bg,
  onClick,
  isActive
}) => {
  return (
    <div
      className={`stat-card ${isActive ? 'active' : ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px',
        borderRadius: '16px',
        backgroundColor: 'var(--card-bg)',
        border: isActive ? `2px solid ${color}` : '1px solid var(--border)',
        boxShadow: isActive ? 'var(--shadow-active)' : 'var(--shadow)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-h)', lineHeight: '1' }}>
          {value}
        </span>
      </div>
      <div
        className="stat-icon-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          color: color,
          backgroundColor: bg,
          transition: 'transform 0.3s',
        }}
      >
        {icon}
      </div>
    </div>
  );
};
export default StatCard;
