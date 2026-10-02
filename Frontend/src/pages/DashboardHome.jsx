import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CheckCircle2,
  Flame,
  ArrowRight,
  Plus,
  User,
  FileText,
  BookOpen,
  Target,
  BarChart3,
  Clock,
  Zap,
  Mic,
  FileSearch,
  Bot,
  Briefcase,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { useAuth } from '../Features/auth/hooks/useAuth';
import { useTheme } from '../context/theme.context';
import { getDashboardData } from '../Features/interview/services/interview.api';

export const DashboardHome = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === 'dark';

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardData();
        if (isMounted) {
          setDashboardData(data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const username = user?.username || 'Prakash2311D';
  const readinessScore = dashboardData?.readinessScore || 66;
  const strategiesCount = dashboardData?.strategiesCount || 0;
  const questionsPracticed = dashboardData?.questionsPracticed || 0;
  const streak = dashboardData?.streak || 0;
  const profile = dashboardData?.profile || null;
  const targetRole = profile?.targetRole || 'DevOps Engineer';
  const resumeName = profile?.resumeFileName || 'DevOps Engineer Resume.pdf';
  const atsScore = profile?.atsScore || 88;

  // Circular gauge circumference
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}
    >
      {/* =====================================================================
          1. WELCOME HERO BANNER (Sunset Warm Gradient with Student Artwork)
         ===================================================================== */}
      <div
        style={{
          borderRadius: '24px',
          background: isDark
            ? 'linear-gradient(135deg, #221a16 0%, #29201a 50%, #1e1713 100%)'
            : 'linear-gradient(135deg, #fff3e6 0%, #fae5d4 50%, #f7ded0 100%)',
          border: isDark ? '1px solid #3d2d24' : '1px solid #f2e2d2',
          padding: '1.75rem 2.25rem',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: isDark
            ? '0 8px 30px rgba(0, 0, 0, 0.4)'
            : '0 8px 30px rgba(191, 84, 43, 0.06)',
          transition: 'background 0.25s ease, border-color 0.25s ease',
        }}
      >
        {/* Decorative Top-Left Sprig SVG */}
        <div style={{ position: 'absolute', top: '8px', left: '12px', opacity: 0.75, pointerEvents: 'none' }}>
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <path d="M6 38C12 32 20 28 32 20M32 20C28 14 20 12 16 16C12 20 14 26 20 28M32 20C36 24 38 32 34 36C30 40 24 38 22 32" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Left Column: Greeting, Subtitle, Active Profile Pill */}
        <div style={{ flex: '1 1 340px', zIndex: 2 }}>
          <h2
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px',
              margin: '0 0 0.4rem 0',
            }}
          >
            {getGreeting()},{' '}
            <span style={{ color: '#bf542b' }}>{username}</span> 👋
          </h2>

          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              margin: '0 0 1.25rem 0',
              fontWeight: 500,
            }}
          >
            Keep practicing, you're one step closer to your goals!
          </p>

          {/* Profile Active Badge Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              backgroundColor: isDark ? '#1a202c' : '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              border: isDark ? '1px solid #2d3748' : '1px solid #f1e6da',
              fontSize: '0.84rem',
              color: 'var(--text-primary)',
              fontWeight: 600,
              transition: 'background-color 0.25s ease',
            }}
          >
            <CheckCircle2 size={16} color="#16a34a" />
            <span>
              Profile active •{' '}
              <strong style={{ color: isDark ? '#38bdf8' : '#0f172a' }}>{resumeName}</strong> (ATS {atsScore}%)
            </span>
          </div>
        </div>

        {/* Center: Practice Learn Improve Doodle + Student Artwork */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            zIndex: 2,
          }}
          className="hero-center-art"
        >
          {/* Handwritten Doodle Note */}
          <div
            style={{
              fontFamily: "'Patrick Hand', 'Caveat', cursive, sans-serif",
              fontSize: '1.35rem',
              lineHeight: 1.25,
              color: isDark ? '#fed7aa' : '#78350f',
              textAlign: 'right',
              userSelect: 'none',
            }}
          >
            <div>Practice</div>
            <div>Learn</div>
            <div>Improve</div>
            <div style={{ color: '#bf542b', fontWeight: 700 }}>
              Get Hired ! 😊
            </div>
          </div>

          {/* Student at Desk Artwork */}
          <div
            style={{
              width: '180px',
              height: '115px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(180, 100, 40, 0.15)',
              border: isDark ? '2px solid #3d2d24' : '2px solid #ffffff',
              flexShrink: 0,
            }}
          >
            <img
              src="/assets/dashboard_hero_student.jpg"
              alt="Kaushal Student"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
              }}
            />
          </div>
        </div>

        {/* Right Column: Quote Speech Bubble + Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '1.15rem',
            zIndex: 2,
          }}
        >
          {/* Quote Card */}
          <div
            style={{
              backgroundColor: isDark ? 'rgba(30, 24, 20, 0.85)' : 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(4px)',
              border: isDark ? '1px solid #4a3528' : '1px solid #ebdccb',
              borderRadius: '14px',
              padding: '0.65rem 1rem',
              color: isDark ? '#fed7aa' : '#78350f',
              maxWidth: '220px',
              textAlign: 'center',
              lineHeight: 1.35,
              fontFamily: "'Patrick Hand', 'Caveat', cursive, sans-serif",
              fontSize: '1.15rem',
              transition: 'background-color 0.25s ease',
            }}
          >
            “Small steps today, big opportunities tomorrow.”
          </div>

          {/* Action Buttons Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Daily Challenge Pill */}
            <button
              onClick={() => navigate('/app/daily-challenge')}
              style={{
                height: '40px',
                padding: '0 1.15rem',
                borderRadius: '9999px',
                backgroundColor: isDark ? '#1a202c' : '#ffffff',
                border: isDark ? '1.5px solid #2d3748' : '1.5px solid #ebdccb',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#2d3748' : '#faf5ee';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#1a202c' : '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Flame size={16} color="#ea580c" />
              <span>Daily Challenge</span>
            </button>

            {/* + New Strategy Pill */}
            <button
              onClick={() => navigate('/app/new-interview')}
              style={{
                height: '40px',
                padding: '0 1.25rem',
                borderRadius: '9999px',
                backgroundColor: '#bf542b',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(191, 84, 43, 0.28)',
                transition: 'all 0.18s ease',
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
              <Plus size={16} strokeWidth={2.5} />
              <span>New Strategy</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. METRIC CARDS ROW (4 Cards)
         ===================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Card 1: Interview Readiness (Circular Progress Ring) */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '1.35rem 1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'background-color 0.25s ease, border-color 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Interview Readiness
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isDark ? 'rgba(2, 132, 199, 0.15)' : '#f0f9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={16} color="#0284c7" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', margin: '0.5rem 0' }}>
            {/* SVG Circular Progress Ring */}
            <div style={{ position: 'relative', width: '74px', height: '74px', flexShrink: 0 }}>
              <svg width="74" height="74" viewBox="0 0 74 74">
                <circle
                  cx="37"
                  cy="37"
                  r={radius}
                  stroke={isDark ? '#1e293b' : '#e2e8f0'}
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="37"
                  cy="37"
                  r={radius}
                  stroke="#0d9488"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  transform="rotate(-90 37 37)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                }}
              >
                {readinessScore}%
              </div>
            </div>

            {/* +12% from last week */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#16a34a',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 20V10M12 20V4M6 20V14" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <span>+12%</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                from last week
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.35, marginTop: '0.35rem' }}>
            Complete your first interview to calculate full readiness
          </div>
        </div>

        {/* Card 2: Strategies Created */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '1.35rem 1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'background-color 0.25s ease, border-color 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Strategies Created
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isDark ? 'rgba(22, 163, 74, 0.15)' : '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={16} color="#16a34a" />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {strategiesCount}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              No strategies created yet
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <button
              onClick={() => navigate('/app/new-interview')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                backgroundColor: isDark ? 'rgba(191, 84, 43, 0.18)' : '#fef2ea',
                color: isDark ? '#f97316' : '#bf542b',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(191, 84, 43, 0.3)' : '#fed7c2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(191, 84, 43, 0.18)' : '#fef2ea')}
            >
              <span>Create Strategy</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Card 3: Questions Practiced */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '1.35rem 1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'background-color 0.25s ease, border-color 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Questions Practiced
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isDark ? 'rgba(147, 51, 234, 0.15)' : '#faf5ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={16} color="#9333ea" />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {questionsPracticed}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Start your first session
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <button
              onClick={() => navigate('/app/question-bank')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                backgroundColor: isDark ? 'rgba(191, 84, 43, 0.18)' : '#fef2ea',
                color: isDark ? '#f97316' : '#bf542b',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(191, 84, 43, 0.3)' : '#fed7c2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(191, 84, 43, 0.18)' : '#fef2ea')}
            >
              <span>Practice Now</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Card 4: Active Streak */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '1.35rem 1.5rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'background-color 0.25s ease, border-color 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Active Streak
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#fff7ed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Flame size={16} color="#ea580c" />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {streak} Days
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Complete today's challenge to start your streak!
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <button
              onClick={() => navigate('/app/daily-challenge')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                backgroundColor: isDark ? 'rgba(191, 84, 43, 0.18)' : '#fef2ea',
                color: isDark ? '#f97316' : '#bf542b',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(191, 84, 43, 0.3)' : '#fed7c2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(191, 84, 43, 0.18)' : '#fef2ea')}
            >
              <span>Start Challenge</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. MIDDLE ROW (Personalized Roadmap + Competency Analysis)
         ===================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Left Card: Personalized Roadmap */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '1.75rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background-color 0.25s ease, border-color 0.25s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Target size={20} color="#bf542b" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Personalized Roadmap
              </h3>
            </div>

            {/* Target Role Tag / Dropdown */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: isDark ? 'rgba(2, 132, 199, 0.15)' : '#f0f9ff',
                color: isDark ? '#38bdf8' : '#0369a1',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: isDark ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid #bae6fd',
              }}
            >
              <span>{targetRole}</span>
              <ChevronRight size={13} />
            </div>
          </div>

          {/* Inner Content Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              alignItems: 'center',
              flex: 1,
            }}
          >
            {/* Target Focus Description */}
            <div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                }}
              >
                TARGET FOCUS
              </span>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0 0.5rem 0' }}>
                Cloud Certification
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 1.25rem 0' }}>
                Acquire professional-level AWS or Kubernetes certifications (e.g., AWS Certified DevOps Engineer or CKA) to formally validate extensive hands-on expertise.
              </p>

              {/* Roadmap Status Bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>Roadmap Status</span>
                  <span>0%</span>
                </div>
                <div style={{ width: '100%', height: '7px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '0%', height: '100%', backgroundColor: '#bf542b', borderRadius: '9999px' }} />
                </div>
              </div>

              {/* View Full Roadmap Button */}
              <button
                onClick={() => navigate('/app/roadmap')}
                style={{
                  width: '100%',
                  height: '42px',
                  backgroundColor: '#bf542b',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 14px rgba(191, 84, 43, 0.25)',
                  transition: 'all 0.18s ease',
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
                <span>View Full Roadmap</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Right Roadmap Trail Graphic */}
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                backgroundColor: isDark ? '#10141d' : '#fbf7f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '220px',
              }}
            >
              <img
                src="/assets/dashboard_roadmap_path.jpg"
                alt="Personalized Preparation Roadmap Path"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Card: Competency Analysis */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '1.75rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'background-color 0.25s ease, border-color 0.25s ease',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <BarChart3 size={20} color="#0284c7" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Competency Analysis
              </h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Based on your recent activity
            </span>
          </div>

          {/* 5 Progress Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* 1. Technical Skills (92%) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                <span>Technical Skills</span>
                <span style={{ fontWeight: 700 }}>92%</span>
              </div>
              <div style={{ width: '100%', height: '7px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)', borderRadius: '9999px' }} />
              </div>
            </div>

            {/* 2. Behavioral & STAR (85%) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                <span>Behavioral & STAR</span>
                <span style={{ fontWeight: 700 }}>85%</span>
              </div>
              <div style={{ width: '100%', height: '7px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #38bdf8 0%, #06b6d4 100%)', borderRadius: '9999px' }} />
              </div>
            </div>

            {/* 3. Communication Clarity (88%) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                <span>Communication Clarity</span>
                <span style={{ fontWeight: 700 }}>88%</span>
              </div>
              <div style={{ width: '100%', height: '7px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '88%', height: '100%', background: 'linear-gradient(90deg, #34d399 0%, #10b981 100%)', borderRadius: '9999px' }} />
              </div>
            </div>

            {/* 4. Project Architecture (90%) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                <span>Project Architecture</span>
                <span style={{ fontWeight: 700 }}>90%</span>
              </div>
              <div style={{ width: '100%', height: '7px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', background: 'linear-gradient(90deg, #a78bfa 0%, #8b5cf6 100%)', borderRadius: '9999px' }} />
              </div>
            </div>

            {/* 5. Problem Solving & DSA (91%) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                <span>Problem Solving & DSA</span>
                <span style={{ fontWeight: 700 }}>91%</span>
              </div>
              <div style={{ width: '100%', height: '7px', backgroundColor: isDark ? '#1e293b' : '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '91%', height: '100%', background: 'linear-gradient(90deg, #fbbf24 0%, #f97316 100%)', borderRadius: '9999px' }} />
              </div>
            </div>
          </div>

          {/* Recommendation Box */}
          <div
            onClick={() => navigate('/app/mock-interview')}
            style={{
              marginTop: '1.25rem',
              backgroundColor: isDark ? 'rgba(194, 65, 12, 0.16)' : '#fff7ed',
              border: isDark ? '1px solid rgba(194, 65, 12, 0.3)' : '1px solid #ffedd5',
              borderRadius: '14px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(194, 65, 12, 0.25)' : '#ffedd5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isDark ? 'rgba(194, 65, 12, 0.16)' : '#fff7ed')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? 'rgba(194, 65, 12, 0.3)' : '#ffedd5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Lightbulb size={16} color="#ea580c" />
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase' }}>
                  Recommendation
                </div>
                <div style={{ fontSize: '0.825rem', color: isDark ? '#fed7aa' : '#431407', fontWeight: 500 }}>
                  Focus on Cloud Certification in your next mock session.
                </div>
              </div>
            </div>

            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: isDark ? '#1a202c' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ea580c',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              }}
            >
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          4. BOTTOM ROW (Recent Strategies + Quick Actions)
         ===================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Left Card: Recent Interview Strategies */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '1.75rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background-color 0.25s ease, border-color 0.25s ease',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Clock size={20} color="var(--text-muted)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Recent Interview Strategies
              </h3>
            </div>
            <button
              onClick={() => navigate('/app/my-interviews')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Empty State */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '1.75rem 1rem',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc',
                border: '1.5px dashed var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <FileText size={24} color="var(--text-muted)" />
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.35rem 0' }}>
              No interview strategies created yet
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '340px', margin: '0 0 1.25rem 0', lineHeight: 1.4 }}>
              Paste a target job description to generate your first AI plan and tailored question bank.
            </p>

            <button
              onClick={() => navigate('/app/new-interview')}
              style={{
                height: '40px',
                padding: '0 1.25rem',
                backgroundColor: '#bf542b',
                color: '#ffffff',
                borderRadius: '9999px',
                fontSize: '0.86rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(191, 84, 43, 0.25)',
                transition: 'all 0.18s ease',
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
              <span>Create Your First Strategy</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Card: Quick Actions */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '24px',
            padding: '1.75rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background-color 0.25s ease, border-color 0.25s ease',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Zap size={20} color="#ea580c" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Quick Actions
              </h3>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </div>

          {/* 4 Action Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.85rem',
              flex: 1,
              alignItems: 'center',
            }}
          >
            {/* 1. Start Mock Interview */}
            <div
              onClick={() => navigate('/app/mock-interview')}
              style={{
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.12)' : '#eefaf2',
                border: isDark ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid #d1fae5',
                borderRadius: '16px',
                padding: '1.1rem 0.75rem',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#1a202c' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                }}
              >
                <Mic size={18} color="#16a34a" />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                Start Mock
                <br />
                Interview
              </span>
            </div>

            {/* 2. Analyze Resume */}
            <div
              onClick={() => navigate('/app/resume-analyzer')}
              style={{
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#fef2f2',
                border: isDark ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid #fee2e2',
                borderRadius: '16px',
                padding: '1.1rem 0.75rem',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#1a202c' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                }}
              >
                <FileSearch size={18} color="#ef4444" />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                Analyze
                <br />
                Resume
              </span>
            </div>

            {/* 3. Chat with AI Coach */}
            <div
              onClick={() => navigate('/app/coach')}
              style={{
                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.12)' : '#f0f4ff',
                border: isDark ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid #e0e7ff',
                borderRadius: '16px',
                padding: '1.1rem 0.75rem',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#1a202c' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                }}
              >
                <Bot size={18} color="#4f46e5" />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                Chat with
                <br />
                AI Coach
              </span>
            </div>

            {/* 4. Explore Jobs */}
            <div
              onClick={() => navigate('/app/job-analyzer')}
              style={{
                backgroundColor: isDark ? 'rgba(245, 158, 11, 0.12)' : '#fdf8ea',
                border: isDark ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid #fef08a',
                borderRadius: '16px',
                padding: '1.1rem 0.75rem',
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(202, 138, 4, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#1a202c' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                }}
              >
                <Briefcase size={18} color="#92400e" />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                Explore
                <br />
                Jobs
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-center-art {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;
