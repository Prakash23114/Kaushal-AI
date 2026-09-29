import React from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Flame,
  BarChart3,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { useInterview } from '../Features/interview/hooks/useInterview';

const WEEKLY_PROGRESS_DATA = [
  { week: 'Week 1', score: 58, technical: 55, behavioral: 62 },
  { week: 'Week 2', score: 67, technical: 64, behavioral: 70 },
  { week: 'Week 3', score: 74, technical: 72, behavioral: 76 },
  { week: 'Week 4', score: 82, technical: 84, behavioral: 80 },
];

const CATEGORY_PRACTICE_DATA = [
  { category: 'JavaScript', practiced: 24 },
  { category: 'React', practiced: 19 },
  { category: 'Node.js', practiced: 15 },
  { category: 'System Design', practiced: 12 },
  { category: 'DSA', practiced: 18 },
  { category: 'Behavioral', practiced: 14 },
];

const SKILL_RADAR_DATA = [
  { subject: 'Technical Accuracy', score: 84 },
  { subject: 'STAR Communication', score: 78 },
  { subject: 'Project Architecture', score: 86 },
  { subject: 'Problem Solving', score: 72 },
  { subject: 'System Design', score: 68 },
  { subject: 'Confidence', score: 80 },
];

export const ProgressAnalytics = () => {
  const { reports } = useInterview();

  const streak = parseInt(localStorage.getItem('kaushal_streak') || '4', 10);
  const totalQuestions = parseInt(localStorage.getItem('kaushal_practiced_count') || '18', 10);

  const averageReadiness =
    reports && reports.length > 0
      ? Math.round(reports.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / reports.length)
      : 82;

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Performance & <span className="gradient-text">Readiness Analytics</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Data-driven insights tracking your weekly score trajectory, competency radar, and practice consistency.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overall Readiness</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>
            {averageReadiness}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--success)', marginTop: '0.35rem' }}>
            +24% progression since Week 1
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Practice Streak</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.5rem' }}>
            {streak} Days 🔥
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Consistent daily drills
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Questions Answered</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.5rem' }}>
            {totalQuestions}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            AI evaluated & scored
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Strategies Formulated</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.5rem' }}>
            {reports?.length || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Tailored role profiles
          </div>
        </div>
      </div>

      {/* ── Visual Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.75rem' }}>
        {/* Chart 1: Readiness Score Over Time */}
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Readiness Score Trend</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Score evolution over consecutive weeks</p>
            </div>
            <span className="badge badge-success">+24%</span>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_PROGRESS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
                <YAxis domain={[40, 100]} stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Breakdown */}
        <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Drills by Technology</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Questions practiced across core subjects</p>
            </div>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_PRACTICE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="category" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="practiced" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Radar Competency Chart */}
      <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
          360° Candidate Competency Profile
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Balanced evaluation across technical rigor, STAR delivery, system design, and communication.
        </p>

        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_RADAR_DATA}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
              <PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" fontSize={12} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--text-muted)" fontSize={10} />
              <Radar name="Candidate Score" dataKey="score" stroke="#8b5cf6" fill="#6366f1" fillOpacity={0.4} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressAnalytics;
