import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Flame,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight
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
import { getAnalyticsData } from '../Features/interview/services/interview.api';

export const ProgressAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getAnalyticsData();
      setAnalytics(res);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1050px', margin: '0 auto', textAlign: 'center', padding: '5rem 0' }}>
        <Sparkles size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1.5rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Calculating real performance analytics...</p>
      </div>
    );
  }

  const hasData = analytics?.hasData;
  const streak = analytics?.streak || 0;
  const totalQuestions = analytics?.totalQuestions || 0;
  const strategiesCount = analytics?.strategiesCount || 0;
  const readinessScore = analytics?.readinessScore || 0;

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
            {analytics?.hasEnoughDataForReadiness ? `${readinessScore}%` : '0%'}
          </div>
          <div style={{ fontSize: '0.78rem', color: analytics?.hasEnoughDataForReadiness ? 'var(--success)' : 'var(--text-muted)', marginTop: '0.35rem' }}>
            {analytics?.hasEnoughDataForReadiness ? 'Dynamic AI calculated' : 'Complete first interview to calculate'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Practice Streak</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.5rem' }}>
            {streak} Days 🔥
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {streak > 0 ? 'Consecutive active days' : 'Start your daily streak today'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Questions Answered</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.5rem' }}>
            {totalQuestions}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {totalQuestions > 0 ? 'AI evaluated & practiced' : 'No questions answered yet'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Strategies Formulated</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.5rem' }}>
            {strategiesCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {strategiesCount > 0 ? 'Tailored role profiles' : 'No strategies created yet'}
          </div>
        </div>
      </div>

      {/* Conditional Charts or Empty State */}
      {!hasData ? (
        <div
          className="glass-card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            border: '1px dashed var(--border-subtle)'
          }}
        >
          <BarChart3 size={48} color="var(--primary)" style={{ margin: '0 auto 1.25rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No performance history yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            Complete your first mock interview to see analytics, score trajectory, and 360° competency breakdown.
          </p>
          <button onClick={() => navigate('/app/mock-interview')} className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <Sparkles size={16} />
            <span>Complete Your First Mock Interview</span>
          </button>
        </div>
      ) : (
        <>
          {/* ── Visual Charts ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.75rem' }}>
            {/* Chart 1: Readiness Score Over Time */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Readiness Score Trend</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Score evolution over consecutive interview sessions</p>
                </div>
                {analytics.averageScore > 0 && (
                  <span className="badge badge-success">{analytics.averageScore}% Avg</span>
                )}
              </div>

              <div style={{ width: '100%', height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.weeklyProgressData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} />
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
                  <BarChart data={analytics.categoryPracticeData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="category" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
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
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics.skillRadarData || []}>
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
        </>
      )}
    </div>
  );
};

export default ProgressAnalytics;
