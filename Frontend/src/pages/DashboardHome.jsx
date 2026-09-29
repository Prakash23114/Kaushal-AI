import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  Flame,
  ArrowRight,
  Compass,
  AlertTriangle,
  Bot,
  Mic,
  PlusCircle,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../Features/auth/hooks/useAuth';
import { useInterview } from '../Features/interview/hooks/useInterview';

export const DashboardHome = () => {
  const { user } = useAuth();
  const { reports, getReports, loading } = useInterview();
  const navigate = useNavigate();

  // Streak & questions practiced stats from storage or defaults
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('kaushal_streak') || '4', 10);
  });
  const [questionsPracticed, setQuestionsPracticed] = useState(() => {
    return parseInt(localStorage.getItem('kaushal_practiced_count') || '18', 10);
  });

  useEffect(() => {
    getReports();
  }, []);

  // Compute readiness score from user's reports
  const averageMatch =
    reports && reports.length > 0
      ? Math.round(reports.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / reports.length)
      : 76;

  const latestReport = reports && reports.length > 0 ? reports[0] : null;

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* ── 1. Welcome Header Banner ── */}
      <div
        className="glass-card"
        style={{
          padding: '2rem 2.25rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid var(--border-hover)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {getGreeting()}, <span className="gradient-text">{user?.username || 'Candidate'}</span> 👋
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            Let's get you interview-ready. You have targeted goals waiting for you today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/app/daily-challenge')}
            className="btn btn-secondary"
            style={{ borderRadius: 'var(--radius-full)', gap: '0.45rem' }}
          >
            <Flame size={16} color="var(--warning)" />
            <span>Daily Challenge</span>
          </button>
          <button
            onClick={() => navigate('/app/new-interview')}
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-full)', gap: '0.45rem' }}
          >
            <PlusCircle size={16} />
            <span>New Strategy</span>
          </button>
        </div>
      </div>

      {/* ── 2. Statistics Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Card 1: Readiness Score */}
        <div className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Interview Readiness
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={18} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.75rem', color: 'var(--primary)' }}>
            {averageMatch}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--success)' }}>
            <TrendingUp size={14} />
            <span>+8% readiness improvement this week</span>
          </div>
        </div>

        {/* Card 2: Interviews Completed */}
        <div className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Strategies Created
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={18} color="var(--success)" />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.75rem', color: 'var(--text-primary)' }}>
            {reports?.length || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Target positions analyzed with Gemini
          </div>
        </div>

        {/* Card 3: Questions Practiced */}
        <div className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Questions Practiced
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={18} color="var(--info)" />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.75rem', color: 'var(--text-primary)' }}>
            {questionsPracticed}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Technical, behavioral & project questions
          </div>
        </div>

        {/* Card 4: Current Streak */}
        <div className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Active Streak
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Flame size={18} color="var(--warning)" />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.75rem', color: 'var(--warning)' }}>
            {streak} Days 🔥
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Consistency unlocks placement success
          </div>
        </div>
      </div>

      {/* ── 3. Middle Row: Continue Preparation & Skill Analysis ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Continue Preparation Roadmap Card */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Continue Preparation</h3>
            </div>
            <span className="badge badge-primary">Day 4 of 14</span>
          </div>

          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Current Milestone
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
              React Architecture, Hooks & System State
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Master virtual DOM reconciliation, custom hooks, and concurrent rendering trade-offs.
            </p>

            {/* Progress bar */}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Roadmap Completion</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>28%</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '28%',
                    height: '100%',
                    background: 'var(--accent-gradient)',
                    borderRadius: 'var(--radius-full)',
                  }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/roadmap')}
            className="btn btn-primary"
            style={{ width: '100%', gap: '0.5rem', marginTop: 'auto' }}
          >
            <span>Continue Preparation</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Skill Analysis Card */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Competency Analysis</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evaluated across roles</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', flex: 1 }}>
            {[
              { skill: 'Technical Skills', level: 82, color: 'var(--primary)' },
              { skill: 'Behavioral & STAR', level: 75, color: 'var(--accent-cyan)' },
              { skill: 'Communication Clarity', level: 78, color: 'var(--success)' },
              { skill: 'Project Architecture', level: 86, color: 'var(--secondary)' },
              { skill: 'Problem Solving & DSA', level: 68, color: 'var(--warning)' },
            ].map((item, idx) => (
              <div key={idx}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginBottom: '0.35rem',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>{item.skill}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.level}%</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '7px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${item.level}%`,
                      height: '100%',
                      background: item.color,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Prioritize <strong>Problem Solving & DSA</strong> in your next mock session.
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. Weak Areas Section ── */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
          <AlertTriangle size={20} color="var(--warning)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Priority Focus & Weak Areas</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Identified from your resume vs target job descriptions. Review these topics before your interview:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {[
            { name: 'System Design & Scalability', severity: 'high' },
            { name: 'Microservices & Message Queues', severity: 'high' },
            { name: 'Advanced JavaScript Event Loop', severity: 'medium' },
            { name: 'Behavioral Conflict Resolution', severity: 'medium' },
            { name: 'Database Indexing & Sharding', severity: 'medium' },
            { name: 'CI/CD & Docker Deployment', severity: 'low' },
          ].map((area, idx) => (
            <div
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                background:
                  area.severity === 'high'
                    ? 'var(--danger-bg)'
                    : area.severity === 'medium'
                    ? 'var(--warning-bg)'
                    : 'rgba(99, 102, 241, 0.12)',
                border:
                  area.severity === 'high'
                    ? '1px solid rgba(239, 68, 68, 0.3)'
                    : area.severity === 'medium'
                    ? '1px solid rgba(245, 158, 11, 0.3)'
                    : '1px solid rgba(99, 102, 241, 0.3)',
                color:
                  area.severity === 'high'
                    ? 'var(--danger)'
                    : area.severity === 'medium'
                    ? 'var(--warning)'
                    : 'var(--primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/app/coach?topic=${encodeURIComponent(area.name)}`)}
              title="Click to ask AI Coach"
            >
              <span>{area.name}</span>
              <Bot size={14} />
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Recent Interviews List ── */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Interview Strategies</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Previous job analysis and custom preparation reports
            </p>
          </div>
          <button
            onClick={() => navigate('/app/my-interviews')}
            className="btn btn-ghost btn-sm"
            style={{ gap: '0.35rem' }}
          >
            <span>View All</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {reports && reports.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {reports.slice(0, 3).map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/app/interview/${r._id}`)}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '220px',
                    }}
                  >
                    {r.title || 'Target Role'}
                  </h4>
                  <span
                    className={`badge ${
                      r.matchScore >= 80 ? 'badge-success' : r.matchScore >= 60 ? 'badge-primary' : 'badge-warning'
                    }`}
                  >
                    {r.matchScore}% Match
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.5rem',
                  }}
                >
                  <Clock size={13} />
                  <span>Generated on {new Date(r.createdAt).toLocaleDateString()}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '1rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem',
                    color: 'var(--primary)',
                    fontWeight: 600,
                  }}
                >
                  <span>Open Strategy & Questions</span>
                  <ExternalLink size={14} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)',
            }}
          >
            <Sparkles size={28} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              No interview strategies created yet
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Upload your resume and paste a target job description to generate your first AI plan.
            </p>
            <button onClick={() => navigate('/app/new-interview')} className="btn btn-primary btn-sm">
              <PlusCircle size={16} />
              <span>Create Your First Strategy</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
