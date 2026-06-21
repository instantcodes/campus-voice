import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  FileText, 
  RefreshCw, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Lock
} from 'lucide-react';

export const Welcome: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'var(--sans)',
      transition: 'all 0.3s ease'
    }}>
      {/* Landing Header/Navbar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--card-bg)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="https://files.catbox.moe/u7j575.png" 
            alt="Campus Voice Logo" 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              objectFit: 'cover'
            }} 
          />
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontWeight: 800, color: 'var(--text-h)', display: 'block', fontSize: '18px', lineHeight: 1.2 }}>
              Campus Voice
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Campus Complaint Management
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <button
              onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              Go to Dashboard
              <ArrowRight size={15} />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-h)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-primary"
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '40px',
        alignItems: 'center',
        padding: '80px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'left'
      }} className="dashboard-split">
        {/* Left Side text */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--accent-bg)',
            color: 'var(--accent)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '24px',
            border: '1px solid var(--accent-border)'
          }}>
            <Sparkles size={14} />
            Empowering Lourdian Campus Operations
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--text-h)',
            marginBottom: '20px',
            letterSpacing: '-1.5px'
          }}>
            Speak Up. <br />
            <span style={{ 
              background: 'linear-gradient(135deg, var(--accent) 0%, #d8b4fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>We are Listening.</span>
          </h1>

          <p style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: 'var(--text)',
            marginBottom: '36px',
            maxWidth: '560px'
          }}>
            Campus Voice is the official complaint resolution platform that directly links students with campus administration. Submit reports, check timeline status, and track repairs instantly.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {user ? (
              <button
                onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  backgroundColor: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '15px',
                  boxShadow: '0 4px 12px rgba(170, 59, 255, 0.2)',
                  transition: 'all 0.2s'
                }}
              >
                Access Dashboard
                <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    backgroundColor: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '15px',
                    boxShadow: '0 4px 12px rgba(170, 59, 255, 0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  File a Complaint
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-h)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '15px',
                    transition: 'all 0.2s'
                  }}
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Replicating reference image style */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '440px',
            aspectRatio: '1',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '8px solid var(--card-bg)'
          }}>
            {/* The circular crop of student graphic */}
            <img 
              src="https://files.catbox.moe/f63iru.png" 
              alt="Campus Voice Graphic" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {/* Dark vignette gradient overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
              pointerEvents: 'none'
            }} />
          </div>

          {/* Floating stat card 1 */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '-20px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-active)',
            zIndex: 10
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--badge-resolved-bg)',
              color: 'var(--badge-resolved)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '18px', fontWeight: 800, color: 'var(--text-h)', lineHeight: 1.1 }}>
                100%
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Response rate
              </span>
            </div>
          </div>

          {/* Floating stat card 2 */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '-10px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-active)',
            zIndex: 10
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-bg)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '16px', fontWeight: 800, color: 'var(--text-h)', lineHeight: 1.1 }}>
                &lt; 24h
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Avg. Resolution
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline / Process Section */}
      <section style={{
        backgroundColor: 'var(--card-bg)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '60px 40px',
        width: '100%'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-h)', marginBottom: '12px' }}>
            How Resolution Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px auto' }}>
            A streamlined 3-step pipeline designed to ensure accountability and fast actions.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {/* Step 1 */}
            <div style={{
              backgroundColor: 'var(--bg)',
              padding: '32px 24px',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                color: '#f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontWeight: 700,
                fontSize: '18px'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-h)', marginBottom: '8px' }}>
                File a Complaint
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Submit a new ticket with details, category, and specific location. Starts as 'Pending'.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{
              backgroundColor: 'var(--bg)',
              padding: '32px 24px',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontWeight: 700,
                fontSize: '18px'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-h)', marginBottom: '8px' }}>
                Track In-Progress Updates
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Administrators review details and change status to 'In Progress', assigning staff.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{
              backgroundColor: 'var(--bg)',
              padding: '32px 24px',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontWeight: 700,
                fontSize: '18px'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-h)', marginBottom: '8px' }}>
                Verify Resolution Details
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Once complete, status changes to 'Resolved' with documented comments on the fix.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '80px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-h)', marginBottom: '12px' }}>
            Built for Modern Campuses
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
            Packed with features designed to maintain transparency and make reporting frictionless.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          {/* Card 1 */}
          <div style={{
            padding: '24px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            textAlign: 'left'
          }}>
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}>
              <FileText size={24} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-h)', marginBottom: '8px' }}>
              Easy Ticketing
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Quickly create tickets categorized by specific campus locations and operational domains.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            padding: '24px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            textAlign: 'left'
          }}>
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}>
              <RefreshCw size={24} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-h)', marginBottom: '8px' }}>
              Live Timelines
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Visual progress step indicators displaying status transitions in real-time.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            padding: '24px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            textAlign: 'left'
          }}>
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}>
              <Lock size={24} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-h)', marginBottom: '8px' }}>
              Secure & Private
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              JWT role-based protection ensuring user reports are private to the author and admins.
            </p>
          </div>

          {/* Card 4 */}
          <div style={{
            padding: '24px',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            textAlign: 'left'
          }}>
            <div style={{ color: 'var(--accent)', marginBottom: '16px' }}>
              <ShieldCheck size={24} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-h)', marginBottom: '8px' }}>
              Admin Panel
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Specialized controls for college offices to filter, categorize, update, and resolve logs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '30px 20px',
        borderTop: '1px solid var(--border)',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--card-bg)',
        marginTop: 'auto'
      }}>
        © {new Date().getFullYear()} Campus Voice. All rights reserved. Built for modern academic coordination.
      </footer>
    </div>
  );
};

export default Welcome;
