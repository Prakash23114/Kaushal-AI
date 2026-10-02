import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Menu,
  Sun,
  Moon,
  Search,
  Bell,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Compass,
} from 'lucide-react';
import { useTheme } from '../../context/theme.context';
import { useAuth } from '../../Features/auth/hooks/useAuth';

export const Navbar = ({ onOpenSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const username = user?.username || 'Prakash2311D';
  const email = user?.email || 'prakashmandal23114@gmail.com';
  const isDark = theme === 'dark';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onLogoutClick = async () => {
    setShowUserMenu(false);
    await handleLogout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard Overview';
    if (path.includes('/coach')) return 'Kaushal AI Coach';
    if (path.includes('/mock-interview')) return 'AI Mock Interview';
    if (path.includes('/resume-analyzer')) return 'ATS Resume Diagnostics';
    if (path.includes('/job-analyzer')) return 'Job Description & Skill Matcher';
    if (path.includes('/question-bank')) return 'Curated Question Bank';
    if (path.includes('/roadmap')) return '14-Day Preparation Roadmap';
    if (path.includes('/my-interviews')) return 'My Interview History';
    if (path.includes('/daily-challenge')) return 'Daily AI Interview Challenge';
    if (path.includes('/new-interview')) return 'Create AI Interview Strategy';
    if (path.includes('/interview/')) return 'Interview Strategy Report';
    return 'Dashboard Overview';
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
        height: '72px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Left: Mobile Toggle + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onOpenSidebar}
          className="mobile-menu-btn"
          aria-label="Toggle Navigation"
          style={{
            display: 'none',
            padding: '0.45rem',
            borderRadius: '10px',
            color: 'var(--text-primary)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
          }}
        >
          <Menu size={20} />
        </button>

        <div>
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.4px',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {getPageTitle()}
          </h1>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              margin: '2px 0 0 0',
              fontWeight: 500,
            }}
          >
            Prepare Smarter • Interview Better • Get Hired
          </p>
        </div>
      </div>

      {/* Right Controls: Pill Search, Day/Night, Bell, User Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Search Pill */}
        <form onSubmit={handleSearchSubmit} className="navbar-search">
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              width: '290px',
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '14px',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions, skills, concepts..."
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '9999px',
                border: '1.5px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                padding: '0 1rem 0 2.35rem',
                fontSize: '0.84rem',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </form>

        {/* Day / Night Mode Pill Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            height: '38px',
            padding: '0 0.55rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        >
          {/* Sun icon */}
          <div
            style={{
              padding: '3px',
              borderRadius: '50%',
              backgroundColor: !isDark ? '#fef3c7' : 'transparent',
              color: !isDark ? '#d97706' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            <Sun size={15} />
          </div>

          {/* Moon icon */}
          <div
            style={{
              padding: '3px',
              borderRadius: '50%',
              backgroundColor: isDark ? '#312e81' : 'transparent',
              color: isDark ? '#c4b5fd' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            <Moon size={14} />
          </div>
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          title="Notifications"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Bell size={17} />
          {/* Red Notification Dot */}
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
            }}
          />
        </button>

        {/* User Pill Button (Dark Orange Avatar 'P' and Prakash2311D) */}
        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              height: '38px',
              padding: '0 0.85rem 0 0.35rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--bg-surface)',
              border: '1.5px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            {/* Dark Orange Avatar Circle 'P' */}
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#c2410c', // Dark Orange!
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(194, 65, 12, 0.3)',
              }}
            >
              {username.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {username}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '230px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                boxShadow: isDark
                  ? '0 12px 30px rgba(0, 0, 0, 0.5)'
                  : '0 12px 30px rgba(180, 110, 50, 0.12)',
                padding: '0.5rem',
                zIndex: 60,
                animation: 'fadeIn 0.15s ease',
              }}
            >
              {/* Profile Header */}
              <div
                style={{
                  padding: '0.75rem 0.85rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#c2410c', // Dark Orange!
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(194, 65, 12, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {username}
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {email}
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div style={{ padding: '0.35rem 0' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/app/dashboard');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <UserIcon size={16} color="var(--text-muted)" />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/app/roadmap');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <Compass size={16} color="var(--text-muted)" />
                  <span>Preparation Roadmap</span>
                </button>
              </div>

              {/* Logout Button */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem' }}>
                <button
                  type="button"
                  onClick={onLogoutClick}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#ef4444',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={16} color="#ef4444" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
