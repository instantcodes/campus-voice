import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { Complaint } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Search, AlertCircle, Trash2, Edit3, Calendar, MapPin, CheckCircle, Save, X } from 'lucide-react';

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

export const MyComplaints: React.FC = () => {
  const { user, complaints, deleteComplaint, updateComplaint } = useApp();
  const locationState = useLocation().state as { selectedId?: string } | null;

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved'>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editError, setEditError] = useState('');

  if (!user) return null;

  const myComplaints = complaints.filter((c) => c.createdBy === user.id);

  // Auto-select complaint from navigation state if present
  useEffect(() => {
    if (locationState?.selectedId) {
      const found = myComplaints.find((c) => c.id === locationState.selectedId);
      if (found) {
        setSelectedComplaint(found);
      }
    } else if (myComplaints.length > 0 && !selectedComplaint) {
      setSelectedComplaint(myComplaints[0]);
    }
  }, [locationState, complaints]);

  const filteredComplaints = myComplaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      const success = await deleteComplaint(id);
      if (success) {
        setSelectedComplaint(null);
        setIsEditing(false);
      }
    }
  };

  const startEdit = (c: Complaint) => {
    setEditTitle(c.title);
    setEditCategory(c.category);
    setEditLocation(c.location);
    setEditDescription(c.description);
    setEditError('');
    setIsEditing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setEditError('');

    if (!editTitle.trim()) {
      setEditError('Title is required');
      return;
    }
    if (!editCategory) {
      setEditError('Category is required');
      return;
    }
    if (!editLocation.trim()) {
      setEditError('Location is required');
      return;
    }
    if (editDescription.length < 15) {
      setEditError('Description must be at least 15 characters long');
      return;
    }

    const success = await updateComplaint(
      selectedComplaint.id,
      editTitle,
      editCategory,
      editDescription,
      editLocation
    );

    if (success) {
      setIsEditing(false);
      // Refresh current selected complaint state
      const updated = complaints.find((c) => c.id === selectedComplaint.id);
      if (updated) setSelectedComplaint(updated);
    } else {
      setEditError('Failed to update complaint');
    }
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
          My Complaints
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Manage your filed reports, check response history, or edit active reports.
        </p>
      </div>

      {/* Main Grid: Left is list, Right is details panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: myComplaints.length > 0 ? '5fr 6fr' : '1fr',
        gap: '24px',
        alignItems: 'start'
      }} className="my-complaints-layout">

        {myComplaints.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            color: 'var(--text-secondary)'
          }}>
            <AlertCircle size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-h)' }}>No Complaints Filed</h3>
            <p style={{ margin: 0, fontSize: '14.5px' }}>
              If you have any campus issue, you can file a new complaint and check details here.
            </p>
          </div>
        ) : (
          <>
            {/* Left Side: Search, Filters & List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Search & Filters */}
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
                    placeholder="Search by title, ID..."
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
                        setIsEditing(false);
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span>{c.category}</span>
                        <span>{new Date(c.createdDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Side: Complaint Details & Actions Panel */}
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
                <>
                  {isEditing ? (
                    /* Edit Form view */
                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-h)' }}>
                          Edit Complaint
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {editError && (
                        <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '12.5px' }}>
                          {editError}
                        </div>
                      )}

                      <div>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text-h)', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Category</label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text-h)', outline: 'none' }}
                        >
                          <option value="">Select category</option>
                          {CATEGORIES.slice(1).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Location</label>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text-h)', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>Description</label>
                        <textarea
                          rows={4}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text-h)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button
                          type="submit"
                          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--accent)', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <Save size={14} />
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Read Details view */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

                      {/* Status Progress Stepper */}
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Resolution Timeline
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '0 8px' }} className="timeline-stepper">
                          {/* Stepper background line */}
                          <div style={{
                            position: 'absolute',
                            left: '24px',
                            right: '24px',
                            top: '16px',
                            height: '2px',
                            backgroundColor: 'var(--border)',
                            zIndex: 1
                          }} />

                          {/* Stepper active progress fill */}
                          <div style={{
                            position: 'absolute',
                            left: '24px',
                            width: selectedComplaint.status === 'Pending' ? '0%' : selectedComplaint.status === 'In Progress' ? '50%' : '100%',
                            right: '24px',
                            top: '16px',
                            height: '2px',
                            backgroundColor: 'var(--accent)',
                            zIndex: 1,
                            transition: 'width 0.4s ease'
                          }} />

                          {/* Step 1: Pending */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '6px', width: '60px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--card-bg)',
                              border: `2px solid ${selectedComplaint.status === 'Pending' || selectedComplaint.status === 'In Progress' || selectedComplaint.status === 'Resolved' ? 'var(--accent)' : 'var(--border)'}`,
                              color: selectedComplaint.status === 'Pending' || selectedComplaint.status === 'In Progress' || selectedComplaint.status === 'Resolved' ? 'var(--accent)' : 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                              fontSize: '12px'
                            }}>
                              {selectedComplaint.status === 'In Progress' || selectedComplaint.status === 'Resolved' ? <CheckCircle size={16} /> : '1'}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-h)' }}>Pending</span>
                          </div>

                          {/* Step 2: In Progress */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '6px', width: '80px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--card-bg)',
                              border: `2px solid ${selectedComplaint.status === 'In Progress' || selectedComplaint.status === 'Resolved' ? 'var(--accent)' : 'var(--border)'}`,
                              color: selectedComplaint.status === 'In Progress' || selectedComplaint.status === 'Resolved' ? 'var(--accent)' : 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                              fontSize: '12px'
                            }}>
                              {selectedComplaint.status === 'Resolved' ? <CheckCircle size={16} /> : '2'}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: selectedComplaint.status === 'In Progress' || selectedComplaint.status === 'Resolved' ? 'var(--text-h)' : 'var(--text-secondary)' }}>In Progress</span>
                          </div>

                          {/* Step 3: Resolved */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '6px', width: '60px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--card-bg)',
                              border: `2px solid ${selectedComplaint.status === 'Resolved' ? 'var(--badge-resolved)' : 'var(--border)'}`,
                              color: selectedComplaint.status === 'Resolved' ? 'var(--badge-resolved)' : 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                              fontSize: '12px'
                            }}>
                              {selectedComplaint.status === 'Resolved' ? <CheckCircle size={16} /> : '3'}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: selectedComplaint.status === 'Resolved' ? 'var(--text-h)' : 'var(--text-secondary)' }}>Resolved</span>
                          </div>
                        </div>
                      </div>

                      {/* Complaint Information details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
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

                      {/* Resolution Details (If Resolved) */}
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
                            Resolution Details
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

                      {/* Edit/Delete Actions (Only if status is Pending) */}
                      {selectedComplaint.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                          <button
                            onClick={() => startEdit(selectedComplaint)}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '10px',
                              borderRadius: '8px',
                              border: '1px solid var(--accent)',
                              backgroundColor: 'transparent',
                              color: 'var(--accent)',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <Edit3 size={14} />
                            Edit Details
                          </button>
                          <button
                            onClick={() => handleDelete(selectedComplaint.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              border: '1px solid #ef4444',
                              backgroundColor: 'transparent',
                              color: '#ef4444',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', opacity: 0.7 }}>
                  <AlertCircle size={40} style={{ marginBottom: '12px' }} />
                  <p>Select a complaint from the list to view its progress.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default MyComplaints;
