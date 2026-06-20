import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { Complaint } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Search, AlertCircle, Edit3, Calendar, MapPin, CheckCircle, Save, X, User } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Classroom',
  'Laboratory',
  'Hostel',
  'Library',
  'Internet/Wi-Fi',
  'Electrical',
  'Water Supply',
  'Cleanliness',
  'Other',
];

export const AdminComplaints: React.FC = () => {
  const { complaints, updateComplaintStatus } = useApp();
  const locationState = useLocation().state as { selectedId?: string; filterStatus?: string } | null;

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved'>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Status editing state
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<'Pending' | 'In Progress' | 'Resolved'>('Pending');
  const [resolutionDetails, setResolutionDetails] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle locationState routing filters
  useEffect(() => {
    if (locationState?.filterStatus) {
      setStatusFilter(locationState.filterStatus as any);
    }
  }, [locationState]);

  // Handle selected complaint from navigation state
  useEffect(() => {
    if (locationState?.selectedId) {
      const found = complaints.find((c) => c.id === locationState.selectedId);
      if (found) {
        setSelectedComplaint(found);
      }
    } else if (complaints.length > 0 && !selectedComplaint) {
      setSelectedComplaint(complaints[0]);
    }
  }, [locationState, complaints]);

  const filteredComplaints = complaints
    .filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.createdByName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdDate).getTime();
      const dateB = new Date(b.createdDate).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const startStatusUpdate = (c: Complaint) => {
    setNewStatus(c.status);
    setResolutionDetails(c.resolutionDetails || '');
    setError('');
    setSuccessMsg('');
    setIsUpdating(true);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setError('');
    setSuccessMsg('');

    if (newStatus === 'Resolved' && !resolutionDetails.trim()) {
      setError('Please provide resolution details describing how the issue was fixed.');
      return;
    }

    const success = await updateComplaintStatus(selectedComplaint.id, newStatus, resolutionDetails);
    if (success) {
      setSuccessMsg('Complaint status updated successfully!');
      setIsUpdating(false);

      // Refresh selected complaint view
      const updated = complaints.find((c) => c.id === selectedComplaint.id);
      if (updated) setSelectedComplaint(updated);
    } else {
      setError('Failed to update status on the server.');
    }

    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ textAlign: 'left' }}>
        <h1 style={{ margin: '0 0 4px 0', fontSize: '28px', letterSpacing: '-0.5px' }}>
          Manage Complaints
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Monitor active issues, update resolution pipelines, and record fixes.
        </p>
      </div>

      {/* Main Grid: Left is filter & list, Right is details panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: complaints.length > 0 ? '5fr 6fr' : '1fr',
        gap: '24px',
        alignItems: 'start'
      }} className="admin-complaints-layout">

        {complaints.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            color: 'var(--text-secondary)'
          }}>
            <AlertCircle size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-h)' }}>No complaints found</h3>
            <p style={{ margin: 0, fontSize: '14.5px' }}>
              Excellent! No complaints have been reported yet in the database.
            </p>
          </div>
        ) : (
          <>
            {/* Left Side: Advanced Filters & List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Filter Form Panel */}
              <div style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, ID, reporter..."
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text-h)',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', textAlign: 'left' }}>Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text-h)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', textAlign: 'left' }}>Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text-h)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', textAlign: 'left' }}>Sort Date</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text-h)',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Complaints List Container */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxHeight: '520px',
                overflowY: 'auto'
              }} className="scrollable-list">
                {filteredComplaints.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)', backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    No matching complaints found.
                  </div>
                ) : (
                  filteredComplaints.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedComplaint(c);
                        setIsUpdating(false);
                      }}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: selectedComplaint?.id === c.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                        backgroundColor: selectedComplaint?.id === c.id ? 'var(--accent-bg)' : 'var(--card-bg)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        boxShadow: selectedComplaint?.id === c.id ? 'var(--shadow-active)' : 'none'
                      }}
                      className="complaint-list-item"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {c.id}
                        </span>
                        <StatusBadge status={c.status} />
                      </div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14.5px', fontWeight: 600, color: 'var(--text-h)' }} className="text-truncate">
                        {c.title}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', alignItems: 'center' }}>
                        <span>By: <strong style={{ color: 'var(--text-h)' }}>{c.createdByName}</strong></span>
                        <span>{c.category}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Side: Details and Updater form */}
            <div style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'left',
              minHeight: '400px',
              position: 'sticky',
              top: '90px'
            }} className="details-panel-container">
              {selectedComplaint ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {successMsg && (
                    <div style={{
                      backgroundColor: 'var(--badge-resolved-bg)',
                      color: 'var(--badge-resolved)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      border: '1px solid var(--badge-resolved)30'
                    }}>
                      {successMsg}
                    </div>
                  )}

                  {/* Top Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid var(--border)', paddingBottom: '16px', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {selectedComplaint.id}
                      </span>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-h)', lineHeight: 1.3 }}>
                        {selectedComplaint.title}
                      </h3>
                    </div>
                    <StatusBadge status={selectedComplaint.status} />
                  </div>

                  {/* Update Status Form Panel */}
                  {isUpdating ? (
                    <form onSubmit={handleStatusSubmit} style={{
                      backgroundColor: 'var(--bg)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Update Status</h4>
                        <button
                          type="button"
                          onClick={() => setIsUpdating(false)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {error && (
                        <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>
                          {error}
                        </div>
                      )}

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Status</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as any)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card-bg)', color: 'var(--text-h)', outline: 'none' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>

                      {newStatus === 'Resolved' && (
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Resolution Details / Action Taken</label>
                          <textarea
                            rows={3}
                            value={resolutionDetails}
                            onChange={(e) => setResolutionDetails(e.target.value)}
                            placeholder="Describe how the problem was resolved (e.g. replaced bulbs, repaired AC connector)."
                            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card-bg)', color: 'var(--text-h)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }}
                          />
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <button
                          type="submit"
                          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--accent)', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <Save size={14} />
                          Save Status
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsUpdating(false)}
                          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => startStatusUpdate(selectedComplaint)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: 'var(--accent)',
                        color: '#fff',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        boxShadow: '0 4px 12px rgba(170, 59, 255, 0.15)'
                      }}
                    >
                      <Edit3 size={15} />
                      Update Complaint Status
                    </button>
                  )}

                  {/* Complaint Details Panel */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={14} />
                        Reporter: <strong style={{ color: 'var(--text-h)' }}>{selectedComplaint.createdByName}</strong>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {formatDate(selectedComplaint.createdDate)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} />
                        {selectedComplaint.location}
                      </span>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        CATEGORY
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-h)' }}>
                        {selectedComplaint.category}
                      </span>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        DESCRIPTION
                      </span>
                      <p style={{ fontSize: '13.5px', color: 'var(--text)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {selectedComplaint.description}
                      </p>
                    </div>
                  </div>

                  {/* Resolution details (If Resolved) */}
                  {selectedComplaint.status === 'Resolved' && (
                    <div style={{
                      backgroundColor: 'var(--badge-resolved-bg)',
                      border: '1px solid var(--badge-resolved)40',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--badge-resolved)'
                      }}>
                        <CheckCircle size={15} />
                        Recorded Resolution details
                      </span>
                      <p style={{ fontSize: '13.5px', color: 'var(--text-h)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                        {selectedComplaint.resolutionDetails}
                      </p>
                      {selectedComplaint.resolvedDate && (
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Resolved on {formatDate(selectedComplaint.resolvedDate)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', opacity: 0.7 }}>
                  <AlertCircle size={40} style={{ marginBottom: '12px' }} />
                  <p>Select a complaint to inspect or update status.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default AdminComplaints;
