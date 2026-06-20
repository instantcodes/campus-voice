import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'Pending' | 'In Progress' | 'Resolved';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let config = {
    color: 'var(--badge-pending)',
    bg: 'var(--badge-pending-bg)',
    icon: <AlertCircle size={14} />,
    label: 'Pending'
  };

  if (status === 'In Progress') {
    config = {
      color: 'var(--badge-progress)',
      bg: 'var(--badge-progress-bg)',
      icon: <Clock size={14} />,
      label: 'In Progress'
    };
  } else if (status === 'Resolved') {
    config = {
      color: 'var(--badge-resolved)',
      bg: 'var(--badge-resolved-bg)',
      icon: <CheckCircle size={14} />,
      label: 'Resolved'
    };
  }

  return (
    <span
      className="status-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12.5px',
        fontWeight: 600,
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.color}20`,
        width: 'fit-content'
      }}
    >
      {config.icon}
      {config.label}
    </span>
  );
};
export default StatusBadge;
