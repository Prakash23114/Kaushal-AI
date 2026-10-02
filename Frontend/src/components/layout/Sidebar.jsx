import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Bot,
  Mic,
  FileSearch,
  Briefcase,
  HelpCircle,
  History,
  Compass,
  Flame,
  BookOpen,
  Plus,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../Features/auth/hooks/useAuth';
import { useTheme } from '../../context/theme.context';

const NAV_ITEMS = [
  { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/coach', label: 'AI Coach', icon: Bot, badge: 'Live', badgeColor: '#e11d48', badgeBg: 'rgba(225, 29, 72, 0.15)' },
  { path: '/app/mock-interview', label: 'Mock Interview', icon: Mic },
  { path: '/app/resume-analyzer', label: 'Resume Analyzer', icon: FileSearch },
  { path: '/app/job-analyzer', label: 'Job Analyzer', icon: Briefcase },
  { path: '/app/question-bank', label: 'Question Bank', icon: HelpCircle },
  { path: '/app/roadmap', label: 'Preparation Roadmap', icon: Compass },
  { path: '/app/my-interviews', label: 'My Interviews', icon: History },
  { path: '/app/daily-challenge', label: 'Daily Challenge', icon: Flame, badge: 'Streak', badgeColor: '#16a34a', badgeBg: 'rgba(22, 163, 74, 0.15)' },
  { path: '/app/resources', label: 'Resources', icon: BookOpen, aliasPath: '/app/question-bank' },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, handleLogout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isDark = theme === 'dark';

  const onLogoutClick = async () => {
    await handleLogout();
    navigate('/login');
  };

  const username = user?.username || 'Prakash2311D';
  const email = user?.email || 'prakashmandal23114@gmail.com';

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 40,
          }}
        />
      )}

      <aside
        style={{
          width: '260px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, border-color 0.25s ease',
          transform: isOpen ? 'translateX(0)' : undefined,
          fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
        }}
        className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.35rem 1.5rem 1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            onClick={() => navigate('/app/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
          >
            {/* Custom Stylized Graduation Cap Logo */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block', flexShrink: 0 }}
            >
              <path d="M18 6L32 13.5L18 21L4 13.5L18 6Z" fill={isDark ? '#e2e8f0' : '#18181b'} />
              <path d="M8.5 16.5V23.5C8.5 27 12.5 30 18 30C23.5 30 27.5 27 27.5 23.5V16.5L18 21.5L8.5 16.5Z" fill={isDark ? '#94a3b8' : '#27272a'} />
              <path d="M30 15V24C30 24.8 29.5 25.5 28.5 25.5" stroke="#bf542b" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="28.5" cy="26" r="2" fill="#bf542b" />
            </svg>

            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px', lineHeight: 1.15 }}>
                Kaushal <span style={{ color: '#bf542b' }}>AI</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '-0.1px' }}>
                Your Career Companion
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="mobile-close-btn"
            style={{
              padding: '0.4rem',
              color: 'var(--text-muted)',
              borderRadius: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Button: + New Strategy (Terracotta Pill) */}
        <div style={{ padding: '0.5rem 1.25rem 0.75rem' }}>
          <button
            onClick={() => {
              navigate('/app/new-interview');
              if (onClose) onClose();
            }}
            style={{
              width: '100%',
              height: '42px',
              padding: '0 1rem',
              backgroundColor: '#bf542b',
              color: '#ffffff',
              borderRadius: '9999px',
              fontSize: '0.925rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(191, 84, 43, 0.28)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#a84218';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#bf542b';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>New Strategy</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.25rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const targetPath = item.aliasPath || item.path;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/app/dashboard' && (location.pathname === '/app' || location.pathname === '/app/'));

            const activeBg = isDark ? 'rgba(191, 84, 43, 0.2)' : '#fef2ea';
            const activeColor = isDark ? '#f97316' : '#bf542b';
            const defaultColor = 'var(--text-secondary)';

            return (
              <NavLink
                key={item.path}
                to={targetPath}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.62rem 0.85rem',
                  borderRadius: '12px',
                  color: isActive ? activeColor : defaultColor,
                  backgroundColor: isActive ? activeBg : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-surface-elevated)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = defaultColor;
                  }
                }}
              >
                {/* Left Active Indicator Bar */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '0px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '22px',
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: '#bf542b',
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} color={isActive ? activeColor : 'var(--text-muted)'} strokeWidth={isActive ? 2.3 : 1.9} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.12rem 0.45rem',
                      borderRadius: '9999px',
                      backgroundColor: item.badgeBg,
                      color: item.badgeColor,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile summary */}
        <div
          style={{
            padding: '0.75rem 1rem 0.5rem 1rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
              {/* Dark Orange User Avatar Circle */}
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#c2410c', // Dark Orange!
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(194, 65, 12, 0.3)',
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

            <button
              onClick={onLogoutClick}
              title="Logout"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Decorative Sticky Card: Practice Improve Grow Get Hired! */}
        <div style={{ padding: '0.5rem 1rem 1rem 1rem' }}>
          <div
            style={{
              backgroundColor: isDark ? '#1a1d26' : '#fbf4ea',
              border: isDark ? '1px solid #2d3544' : '1px solid #ebdccb',
              borderRadius: '16px',
              padding: '1rem 1.1rem',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background-color 0.25s ease, border-color 0.25s ease',
            }}
          >
            {/* Doodle Rocket SVG in top right */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                transform: 'rotate(18deg)',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
                  fill="#ea580c"
                />
                <path
                  d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
                  stroke="#bf542b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="15.5" cy="8.5" r="1.5" fill="#bf542b" />
              </svg>
            </div>

            {/* Handwritten Text */}
            <div
              style={{
                fontFamily: "'Patrick Hand', 'Caveat', cursive, sans-serif",
                fontSize: '1.25rem',
                lineHeight: '1.25',
                color: isDark ? '#fed7aa' : '#78350f',
                fontWeight: 600,
              }}
            >
              <div>Practice</div>
              <div>Improve</div>
              <div>Grow</div>
              <div style={{ color: '#bf542b', fontWeight: 700 }}>Get Hired !</div>
            </div>

            {/* Decorative Plant Leaves Graphic at Bottom */}
            <div
              style={{
                marginTop: '0.65rem',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '4px',
                opacity: 0.85,
              }}
            >
              <svg width="100%" height="32" viewBox="0 0 160 36" fill="none">
                <path d="M72 26H88L85 34H75L72 26Z" fill="#d97706" />
                <path d="M80 26C80 20 74 16 70 18C70 24 76 25 80 26Z" fill="#15803d" />
                <path d="M80 26C80 18 86 14 90 16C90 22 84 25 80 26Z" fill="#16a34a" />
                <path d="M80 26C78 14 82 8 80 4C78 8 76 16 80 26Z" fill="#22c55e" />
                <path d="M50 34C45 28 42 18 36 22C36 30 44 32 50 34Z" fill="#15803d" />
                <path d="M110 34C115 28 118 18 124 22C124 30 116 32 110 34Z" fill="#16a34a" />
              </svg>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
