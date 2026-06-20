import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FilePlus, ArrowLeft, Send, Check } from 'lucide-react';

const CATEGORIES = [
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

export const SubmitComplaint: React.FC = () => {
  const { addComplaint } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a short complaint title.');
      return;
    }
    if (title.length < 5) {
      setError('Title should be at least 5 characters long.');
      return;
    }
    if (!category) {
      setError('Please select a complaint category.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a detailed description of the issue.');
      return;
    }
    if (description.length < 15) {
      setError('Description should be descriptive (minimum 15 characters).');
      return;
    }
    if (!location.trim()) {
      setError('Please specify the location (e.g., block, classroom number, hostel room).');
      return;
    }

    const success = await addComplaint(title, category, description, location);
    if (success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/student/complaints');
      }, 1500);
    } else {
      setError('Failed to submit complaint to the server database. Please try again.');
    }
  };

  if (success) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '24px'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--badge-resolved-bg)',
          color: 'var(--badge-resolved)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)',
          border: '1px solid var(--badge-resolved)'
        }}>
          <Check size={36} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-h)' }}>
          Complaint Submitted Successfully!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
          Your complaint is logged and is pending review. Redirecting to complaints page...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '680px', margin: '0 auto', textAlign: 'left' }}>
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          fontSize: '14px',
          fontWeight: 500,
          padding: '0 0 16px 0',
          transition: 'color 0.2s'
        }}
        className="back-btn"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: 'var(--shadow)'
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <div style={{
            backgroundColor: 'var(--accent-bg)',
            color: 'var(--accent)',
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FilePlus size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: 'var(--text-h)' }}>
              File a New Complaint
            </h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13.5px' }}>
              Provide clear details about the campus issue so our team can resolve it efficiently.
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '13.5px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-h)', marginBottom: '8px' }}>
              Complaint Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Water leak in Hostel B third floor restroom"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-h)', marginBottom: '8px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-h)', marginBottom: '8px' }}>
              Specific Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Hostel B, Room 304 washroom / Lab 2 near window"
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

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-h)', marginBottom: '8px' }}>
              Detailed Description
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe what the issue is, when it started, and its current impact."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text-h)',
                fontSize: '14.5px',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
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
            <Send size={16} />
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};
export default SubmitComplaint;
