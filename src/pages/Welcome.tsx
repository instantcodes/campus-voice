import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  CheckCircle, 
  Shield, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  ChevronDown, 
  Activity, 
  Zap 
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import './Welcome.css';

export const Welcome: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({ complaints: 0, resolved: 0, activeUsers: 0 });

  // Handle header background transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animating stats counters on load/scroll
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let step = 0;

    const targetComplaints = 384;
    const targetResolved = 342;
    const targetUsers = 1200;

    const timer = setInterval(() => {
      step++;
      setStats({
        complaints: Math.floor((targetComplaints / steps) * step),
        resolved: Math.floor((targetResolved / steps) * step),
        activeUsers: Math.floor((targetUsers / steps) * step),
      });

      if (step >= steps) {
        setStats({ complaints: targetComplaints, resolved: targetResolved, activeUsers: targetUsers });
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for scroll-reveal fallback support
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } else {
      navigate('/register');
    }
  };

  const faqs = [
    {
      q: "Can I submit complaints anonymously?",
      a: "Yes, confidentiality is a key feature of Campus Voice. You can choose to hide your identity from other students and/or administrators when submitting a grievance."
    },
    {
      q: "How does the tracking system work?",
      a: "Every filed complaint is assigned a status: 'Pending', 'In Progress', or 'Resolved'. You will receive live status updates and communication from college administrators as they work on a resolution."
    },
    {
      q: "Who reviews the complaints?",
      a: "Only verified campus administrators and college grievance committee members have access to the administrative dashboard to review and assign actions to complaints."
    },
    {
      q: "Can I edit or delete my complaints?",
      a: "Yes, students have full control to edit details or delete their active reports before an administrator begins resolving the issue."
    }
  ];

  return (
    <div className="welcome-container">
      {/* Scroll Progress Bar (Pure CSS animation-timeline driven) */}
      <div className="scroll-progress-bar"></div>

      {/* Hero Background Elements */}
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Header / Navbar */}
      <header className={`welcome-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-brand">
          <img src="https://files.catbox.moe/u7j575.png" alt="Campus Voice Logo" className="header-logo" />
          <div className="header-titles">
            <span className="brand-name">Campus Voice</span>
            <span className="brand-tagline">Grievance Portal</span>
          </div>
        </div>

        <div className="header-actions">
          <ThemeToggle />
          {user ? (
            <button className="btn-dashboard" onClick={handleGetStarted}>
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <Link to="/login" className="link-login">Sign In</Link>
              <button className="btn-register" onClick={handleGetStarted}>
                <span>Get Started</span>
                <Sparkles size={14} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-wrapper reveal-on-scroll">
            <span className="hero-badge">
              <Zap size={12} className="badge-icon" />
              Empowering Student Representation
            </span>
          </div>
          
          <h1 className="hero-title reveal-on-scroll">
            Make Your Voice Heard. <br />
            <span className="gradient-text">Shape Your Campus.</span>
          </h1>

          <p className="hero-description reveal-on-scroll">
            Campus Voice is a secure, transparent grievance management system built on the MERN stack. 
            Report issues, track resolutions in real-time, and collaborate to build a better university community.
          </p>

          <div className="hero-buttons reveal-on-scroll">
            <button className="btn-hero-primary" onClick={handleGetStarted}>
              <span>Submit a Voice</span>
              <ArrowRight size={18} />
            </button>
            <a href="#how-it-works" className="btn-hero-secondary">
              <span>How It Works</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="hero-metrics reveal-on-scroll">
            <div className="metric-item">
              <span className="metric-num">{stats.complaints}+</span>
              <span className="metric-label">Grievances Raised</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-num">{stats.resolved}+</span>
              <span className="metric-label">Issues Resolved</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-num">{stats.activeUsers}+</span>
              <span className="metric-label">Active Campus Users</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive UI Card Display */}
        <div className="hero-visual reveal-on-scroll">
          <div className="floating-ui-card card-main">
            <div className="card-header">
              <span className="status-indicator active"></span>
              <span>Recent Campus Activity</span>
            </div>
            <div className="card-body">
              <div className="voice-item">
                <div className="voice-icon-box orange">
                  <MessageSquare size={16} />
                </div>
                <div className="voice-details">
                  <h4>Wi-Fi connectivity issues in Block B</h4>
                  <div className="voice-meta">
                    <span className="category">Infrastructure</span>
                    <span className="time">2m ago</span>
                  </div>
                </div>
                <span className="status-pill pending">Pending</span>
              </div>

              <div className="voice-item">
                <div className="voice-icon-box blue">
                  <Activity size={16} />
                </div>
                <div className="voice-details">
                  <h4>Request for additional library seating</h4>
                  <div className="voice-meta">
                    <span className="category">Academics</span>
                    <span className="time">1h ago</span>
                  </div>
                </div>
                <span className="status-pill progress">In Progress</span>
              </div>

              <div className="voice-item">
                <div className="voice-icon-box green">
                  <CheckCircle size={16} />
                </div>
                <div className="voice-details">
                  <h4>Water cooler repair on 2nd Floor</h4>
                  <div className="voice-meta">
                    <span className="category">Hostel</span>
                    <span className="time">5h ago</span>
                  </div>
                </div>
                <span className="status-pill resolved">Resolved</span>
              </div>
            </div>
          </div>

          <div className="floating-ui-card card-overlay-1">
            <div className="stat-circle">
              <TrendingUp size={20} className="stat-icon" />
              <div>
                <h4>92%</h4>
                <p>Resolution Rate</p>
              </div>
            </div>
          </div>

          <div className="floating-ui-card card-overlay-2">
            <div className="secure-badge">
              <Shield size={16} className="secure-icon" />
              <span>100% Encrypted & Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section" id="features">
        <div className="section-header reveal-on-scroll">
          <h2 className="section-title">Designed for Campus Trust</h2>
          <p className="section-subtitle">
            Everything you need to report, manage, and resolve college issues effectively and securely.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card reveal-on-scroll">
            <div className="feature-icon-wrapper">
              <Lock size={24} />
            </div>
            <h3>Anonymous Reporting</h3>
            <p>Speak up without hesitation. Choose to keep your identity completely private or share it with administrators only.</p>
          </div>

          <div className="feature-card reveal-on-scroll">
            <div className="feature-icon-wrapper">
              <Activity size={24} />
            </div>
            <h3>Real-time Tracking</h3>
            <p>No more black holes. Track your issue status from filing to investigation, all the way to final resolution.</p>
          </div>

          <div className="feature-card reveal-on-scroll">
            <div className="feature-icon-wrapper">
              <Shield size={24} />
            </div>
            <h3>Direct Authority Link</h3>
            <p>Cut through the red tape. Your voices go directly to verified administration dashboards for instant action.</p>
          </div>

          <div className="feature-card reveal-on-scroll">
            <div className="feature-icon-wrapper">
              <Users size={24} />
            </div>
            <h3>Interactive Feedback</h3>
            <p>Collaborate and discuss resolutions with administrators through nested communication logs and status updates.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-header reveal-on-scroll">
          <h2 className="section-title">How Campus Voice Works</h2>
          <p className="section-subtitle">A simple four-step cycle from identifying an issue to its permanent resolution.</p>
        </div>

        <div className="timeline">
          <div className="timeline-item reveal-on-scroll">
            <div className="timeline-number">1</div>
            <div className="timeline-content">
              <h3>Create Your Account</h3>
              <p>Sign up securely using your institutional student credentials. Your email determines verification.</p>
            </div>
          </div>

          <div className="timeline-item reveal-on-scroll">
            <div className="timeline-number">2</div>
            <div className="timeline-content">
              <h3>File Your Grievance</h3>
              <p>Fill out the complaint form specifying category, description, and location. Attach images or mark as anonymous.</p>
            </div>
          </div>

          <div className="timeline-item reveal-on-scroll">
            <div className="timeline-number">3</div>
            <div className="timeline-content">
              <h3>Track Investigation</h3>
              <p>Administrators review the submission and change status to 'In Progress', adding comments or notes.</p>
            </div>
          </div>

          <div className="timeline-item reveal-on-scroll">
            <div className="timeline-number">4</div>
            <div className="timeline-content">
              <h3>Transparent Resolution</h3>
              <p>Receive detailed resolution feedback. Your case is marked resolved once fixed. Transparent and simple.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="section-header reveal-on-scroll">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Have questions? Here are the most common inquiries regarding Campus Voice.</p>
        </div>

        <div className="faq-list reveal-on-scroll">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeFaq === index ? 'active' : ''}`}
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
            >
              <div className="faq-question">
                <span>{faq.q}</span>
                <ChevronDown size={18} className="faq-chevron" />
              </div>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section reveal-on-scroll">
        <div className="cta-container">
          <h2>Empower Your Institution Today</h2>
          <p>Join thousands of students and faculty members raising standards and solving campus concerns in real time.</p>
          <button className="btn-cta" onClick={handleGetStarted}>
            <span>Submit Your First Report</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
