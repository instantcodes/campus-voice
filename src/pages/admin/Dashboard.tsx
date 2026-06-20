import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { FileText, Clock, CheckCircle, RefreshCcw, ArrowRight, ShieldAlert } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, complaints, fetchComplaints } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (!user) return null;

  // Global calculations
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  // Get top 4 pending complaints
  const urgentQueue = complaints.filter((c) => c.status === 'Pending').slice(0, 4);

  // Group complaints by Category
  const categories = [
    'Classroom',
    'Laboratory',
    'Hostel',
    'Library',
    'Internet/Wi-Fi',
    'Electrical',
    'Water Supply',
    'Cleanliness',
    'Other'
  ];

  const categoryCounts = categories.map((cat) => {
    const count = complaints.filter((c) => c.category === cat).length;
    return { name: cat, count };
  });

  const maxCount = Math.max(...categoryCounts.map((c) => c.count), 1);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome & Info banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '28px', letterSpacing: '-0.5px' }}>
            Admin Control Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            System metrics, breakdown analysis, and unresolved campus tickets.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/complaints')}
          className="btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            backgroundColor: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14.5px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(170, 59, 255, 0.15)'
          }}
        >
          <ShieldAlert size={16} />
          Review Complaints Queue
        </button>
      </div>

      {/* Global Admin StatCards Grid */}
      <div
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}
      >
        <StatCard
          title="Total Campus Issues"
          value={total}
          icon={<FileText size={22} />}
          color="var(--accent)"
          bg="var(--accent-bg)"
        />
        <StatCard
          title="Unassigned / Pending"
          value={pending}
          icon={<Clock size={22} />}
          color="var(--badge-pending)"
          bg="var(--badge-pending-bg)"
        />
        <StatCard
          title="Under Resolution"
          value={inProgress}
          icon={<RefreshCcw size={22} />}
          color="var(--badge-progress)"
          bg="var(--badge-progress-bg)"
        />
        <StatCard
          title="Fully Resolved"
          value={resolved}
          icon={<CheckCircle size={22} />}
          color="var(--badge-resolved)"
          bg="var(--badge-resolved-bg)"
        />
      </div>

      {/* Grid: Left is Category chart, Right is Pending queue */}
      <div
        className="dashboard-split"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '28px',
          alignItems: 'start'
        }}
      >
        {/* Category Breakdown (HTML/CSS Bar Chart) */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            padding: '24px',
            textAlign: 'left'
          }}
        >
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, color: 'var(--text-h)' }}>
            Category-wise Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoryCounts.map((cat) => {
              const percentage = (cat.count / maxCount) * 100;
              return (
                <div key={cat.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 500 }}>
                    <span style={{ color: 'var(--text-h)' }}>{cat.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{cat.count} ticket{cat.count !== 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--code-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: cat.count > 0 ? 'var(--accent)' : 'var(--border)',
                        borderRadius: '4px',
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Pending Queue */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            padding: '24px',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-h)' }}>
              Pending Action Queue
            </h3>
            {pending > 0 && (
              <span
                onClick={() => navigate('/admin/complaints', { state: { filterStatus: 'Pending' } })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                View All Pending ({pending}) <ArrowRight size={14} />
              </span>
            )}
          </div>

          {urgentQueue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <CheckCircle size={48} style={{ opacity: 0.3, marginBottom: '12px', color: 'var(--badge-resolved)' }} />
              <p style={{ fontSize: '14.5px', margin: 0 }}>All complaints reviewed!</p>
              <span style={{ fontSize: '12.5px', opacity: 0.8 }}>No tickets in the pending queue.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {urgentQueue.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate('/admin/complaints', { state: { selectedId: c.id } })}
                  className="complaint-row-card"
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: 'var(--bg)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {c.id}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {formatDate(c.createdDate)}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text-h)' }} className="text-truncate">
                    {c.title}
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>By: <strong style={{ color: 'var(--text-h)' }}>{c.createdByName}</strong></span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{c.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
