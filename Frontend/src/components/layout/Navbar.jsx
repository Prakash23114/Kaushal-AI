import  { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Menu,
  Sun,
  Moon,
  Search,
  Bell,
  Sparkles,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../../context/theme.context';
import { useAuth } from '../../Features/auth/hooks/useAuth';

export const Navbar = ({ onOpenSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Map route to human title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard Overview';
    if (path.includes('/coach')) return 'Kaushal AI Coach';
    if (path.includes('/mock-interview')) return 'AI Mock Interview';
    if (path.includes('/project-interview')) return 'Project Defense Mode';
    if (path.includes('/resume-analyzer')) return 'ATS Resume Diagnostics';
    if (path.includes('/job-analyzer')) return 'Job Description & Skill Matcher';
    if (path.includes('/question-bank')) return 'Curated Question Bank';
    if (path.includes('/roadmap')) return '14-Day Preparation Roadmap';
    if (path.includes('/my-interviews')) return 'My Interview History';
    if (path.includes('/progress')) return 'Performance Analytics';
    if (path.includes('/daily-challenge')) return 'Daily AI Interview Challenge';
    if (path.includes('/new-interview')) return 'Create AI Interview Strategy';
    if (path.includes('/interview/')) return 'Interview Strategy Report';
    return 'Kaushal AI';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/question-bank?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      style={{
        height: '70px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.75rem',
      }}
    >
      {/* Left: Mobile hamburger + Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onOpenSidebar}
          className="mobile-menu-btn"
          aria-label="Toggle Navigation"
          style={{
            display: 'none',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            background: 'var(--bg-surface-elevated)',
          }}
        >
          <Menu size={20} />
        </button>

        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {getPageTitle()}
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Prepare Smarter • Interview Better • Get Hired
          </p>
        </div>
      </div>

      {/* Right: Search, Quick New Button, Theme Toggle, Notifications, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="navbar-search" style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search questions, skills, concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '260px',
              padding: '0.5rem 1rem 0.5rem 2.25rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'all var(--transition-fast)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.width = '300px';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-subtle)';
              e.target.style.width = '260px';
            }}
          />
        </form>

        {/* Quick New Strategy Button */}
        <button
          onClick={() => navigate('/app/new-interview')}
          className="btn btn-primary btn-sm"
          style={{ gap: '0.4rem', borderRadius: 'var(--radius-full)' }}
        >
          <PlusCircle size={15} />
          <span>New Strategy</span>
        </button>

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              position: 'relative',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--primary)',
                boxShadow: '0 0 8px var(--primary)',
              }}
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '48px',
                width: '320px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '1rem',
                zIndex: 60,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '0.75rem',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</span>
                <span className="badge badge-primary">2 new</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface-elevated)',
                  }}
                >
                  <CheckCircle2 size={16} color="var(--success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Daily Challenge Ready</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Complete today's 3 questions to maintain your streak.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface-elevated)',
                  }}
                >
                  <Sparkles size={16} color="var(--primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Kaushal AI Coach Updated</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Ready to simulate technical and project defense questions.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div
          onClick={() => navigate('/app/dashboard')}
          title={user?.email || 'Profile'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              maxWidth: '110px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.username || 'Candidate'}
          </span>
        </div>
      </div>
    </header>
  );
};
