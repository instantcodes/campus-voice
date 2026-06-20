import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { FileText, Clock, CheckCircle, PlusCircle, ArrowRight, MessageSquareCode } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, complaints, fetchComplaints } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (!user) return null;

  // Filter complaints raised by this student
  const myComplaints = complaints.filter((c) => c.createdBy === user.id);

  const total = myComplaints.length;
  const pending = myComplaints.filter((c) => c.status === 'Pending').length;
  const inProgress = myComplaints.filter((c) => c.status === 'In Progress').length;
  const resolved = myComplaints.filter((c) => c.status === 'Resolved').length;

  const recentComplaints = myComplaints.slice(0, 3); // Get latest 3

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header and Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '28px', letterSpacing: '-0.5px' }}>
            Hello, {user.name}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Welcome to Campus Voice. File new complaints or track existing ones.
          </p>
        </div>
        <button
          onClick={() => navigate('/student/submit')}
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
          <PlusCircle size={16} />
          File New Complaint
        </button>
      </div>

      {/* Stats Summary Grid */}
      <div
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}
      >
        <StatCard
          title="Total Complaints Raised"
          value={total}
          icon={<FileText size={22} />}
          color="var(--accent)"
          bg="var(--accent-bg)"
        />
        <StatCard
          title="Pending Review"
          value={pending}
          icon={<Clock size={22} />}
          color="var(--badge-pending)"
          bg="var(--badge-pending-bg)"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={<MessageSquareCode size={22} />}
          color="var(--badge-progress)"
          bg="var(--badge-progress-bg)"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          icon={<CheckCircle size={22} />}
          color="var(--badge-resolved)"
          bg="var(--badge-resolved-bg)"
        />
      </div>

      {/* Main Content Split Layout */}
      <div
        className="dashboard-split"
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '28px',
          alignItems: 'start'
        }}
      >
        {/* Recent Complaints List */}
        <div
          className="dashboard-panel"
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
              Recent Complaints
            </h3>
            {total > 0 && (
              <Link
                to="/student/complaints"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13.5px',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                View All <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {recentComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <FileText size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ fontSize: '14.5px', margin: 0 }}>You haven't filed any complaints yet.</p>
              <Link to="/student/submit" style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 600, display: 'inline-block', marginTop: '8px' }}>
                Create your first complaint now
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentComplaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate('/student/complaints', { state: { selectedId: c.id } })}
                  className="complaint-row-card"
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: 'var(--bg)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px', gap: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-h)' }} className="text-truncate">
                      {c.title}
                    </h4>
                    <StatusBadge status={c.status} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>Category: <strong style={{ color: 'var(--text-h)' }}>{c.category}</strong></span>
                    <span>Filed on {formatDate(c.createdDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guidance / FAQ Info Card */}
        <div
          className="info-sidebar"
          style={{
            backgroundColor: 'var(--accent-bg)',
            border: '1px solid var(--accent-border)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'left',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-h)' }}>
            💡 Campus Voice Info
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13.5px', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>
              <strong>Draft State:</strong> You can edit or delete your complaints as long as the status is still <strong>Pending</strong>.
            </li>
            <li>
              <strong>In Progress:</strong> Administrators have acknowledged your complaint and assigned staff to resolve it.
            </li>
            <li>
              <strong>Categories:</strong> Select from 9 infrastructure categories to direct your complaints to the correct department.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default StudentDashboard;
