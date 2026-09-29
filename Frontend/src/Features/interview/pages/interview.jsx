import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Code2,
  Users,
  Compass,
  Download,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Bot,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  Printer
} from 'lucide-react';
import { useInterview } from '../hooks/useInterview';

export const Interview = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { report, getReportById, loading, getResumePdf } = useInterview();

  const [activeTab, setActiveTab] = useState('technical');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [openQuestions, setOpenQuestions] = useState({ 0: true });
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(`kaushal_roadmap_done_${interviewId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  const toggleQuestion = (idx) => {
    setOpenQuestions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleToggleTask = (taskKey) => {
    setCompletedTasks((prev) => {
      const updated = { ...prev, [taskKey]: !prev[taskKey] };
      localStorage.setItem(`kaushal_roadmap_done_${interviewId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleDownloadResume = async () => {
    setDownloadingPdf(true);
    try {
      await getResumePdf(interviewId);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading || !report) {
    return (
      <div
        className="glass-card"
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '600px',
          margin: '3rem auto',
        }}
      >
        <Sparkles size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Loading Interview Strategy...</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
          Retrieving personalized questions, behavioral frameworks, and roadmap.
        </p>
      </div>
    );
  }

  const scoreColor =
    report.matchScore >= 80 ? 'var(--success)' : report.matchScore >= 60 ? 'var(--primary)' : 'var(--warning)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* ── 1. Executive Summary Header Banner ── */}
      <div
        className="glass-card"
        style={{
          padding: '2rem 2.25rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.06) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">Personalized Plan</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Generated on {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            {report.title || 'Target Position'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
            Tailored technical depth, STAR behavioral questions, and actionable roadmap.
          </p>
        </div>

        {/* Match score pill & PDF download button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 1.25rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: `3px solid ${scoreColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
                color: scoreColor,
              }}
            >
              {report.matchScore}%
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Profile Match</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                {report.matchScore >= 80 ? 'Strong Match' : report.matchScore >= 60 ? 'Moderate Match' : 'Growth Needed'}
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadResume}
            disabled={downloadingPdf}
            className="btn btn-secondary"
            style={{ gap: '0.5rem', borderRadius: 'var(--radius-md)' }}
          >
            <Printer size={16} />
            <span>{downloadingPdf ? 'Generating PDF...' : 'Download ATS Resume'}</span>
          </button>

          <button
            onClick={() => navigate(`/app/coach?role=${encodeURIComponent(report.title || '')}`)}
            className="btn btn-primary"
            style={{ gap: '0.5rem', borderRadius: 'var(--radius-md)' }}
          >
            <Bot size={16} />
            <span>Practice with AI Coach</span>
          </button>
        </div>
      </div>

      {/* ── 2. Strategy Navigation Tabs & Content Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '2rem' }} className="report-grid">
        {/* Main Content (Left) */}
        <div>
          {/* Tab Switcher */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.75rem',
              marginBottom: '1.75rem',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'technical', label: `Technical Questions (${report.technicalQuestions?.length || 0})`, icon: Code2 },
              { id: 'behavioral', label: `Behavioral Questions (${report.behavioralQuestions?.length || 0})`, icon: Users },
              { id: 'roadmap', label: `14-Day Roadmap (${report.preparationPlan?.length || 0} Days)`, icon: Compass },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all var(--transition-fast)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--primary)' : 'var(--border-subtle)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: TECHNICAL QUESTIONS */}
          {activeTab === 'technical' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {report.technicalQuestions?.map((q, idx) => {
                const isOpen = !!openQuestions[idx];
                return (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      transition: 'border-color var(--transition-fast)',
                      borderColor: isOpen ? 'var(--border-hover)' : 'var(--border-subtle)',
                    }}
                  >
                    <div
                      onClick={() => toggleQuestion(idx)}
                      style={{
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        gap: '1rem',
                        background: isOpen ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: 'var(--primary)',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            marginTop: '2px',
                          }}
                        >
                          Q{idx + 1}
                        </span>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.4 }}>
                            {q.question}
                          </h4>
                        </div>
                      </div>

                      <div style={{ color: 'var(--text-muted)', paddingTop: '4px' }}>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    {isOpen && (
                      <div
                        style={{
                          padding: '0 1.5rem 1.5rem',
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1.25rem',
                        }}
                      >
                        {/* Interviewer Intention */}
                        <div
                          style={{
                            background: 'var(--bg-surface-elevated)',
                            padding: '1rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '4px solid var(--primary)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: 'var(--primary)',
                              marginBottom: '0.25rem',
                            }}
                          >
                            Interviewer Intention & Evaluation Criteria
                          </div>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                            {q.intention}
                          </p>
                        </div>

                        {/* Model Answer Strategy */}
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '0.5rem',
                            }}
                          >
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                              Recommended Answer Strategy & Concepts
                            </span>
                            <button
                              onClick={() => handleCopy(q.answer, idx)}
                              className="btn btn-ghost btn-sm"
                              style={{ gap: '0.35rem', fontSize: '0.78rem' }}
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check size={14} color="var(--success)" />
                                  <span style={{ color: 'var(--success)' }}>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={14} />
                                  <span>Copy Strategy</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div
                            style={{
                              background: 'var(--bg-surface-elevated)',
                              padding: '1.25rem',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '0.9rem',
                              lineHeight: 1.6,
                              color: 'var(--text-primary)',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {q.answer}
                          </div>
                        </div>

                        {/* Quick action: Practice with Coach */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() =>
                              navigate(
                                `/app/coach?prompt=${encodeURIComponent(
                                  `Test my answer for this technical question: "${q.question}"`
                                )}`
                              )
                            }
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '0.4rem' }}
                          >
                            <Bot size={15} />
                            <span>Practice This Question in AI Coach</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: BEHAVIORAL QUESTIONS */}
          {activeTab === 'behavioral' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {report.behavioralQuestions?.map((q, idx) => {
                const isOpen = !!openQuestions[idx];
                return (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      borderColor: isOpen ? 'var(--border-hover)' : 'var(--border-subtle)',
                    }}
                  >
                    <div
                      onClick={() => toggleQuestion(idx)}
                      style={{
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(56, 189, 248, 0.15)',
                            color: 'var(--info)',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            marginTop: '2px',
                          }}
                        >
                          STAR {idx + 1}
                        </span>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.4 }}>
                            {q.question}
                          </h4>
                        </div>
                      </div>

                      <div style={{ color: 'var(--text-muted)', paddingTop: '4px' }}>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    {isOpen && (
                      <div
                        style={{
                          padding: '0 1.5rem 1.5rem',
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1.25rem',
                        }}
                      >
                        <div
                          style={{
                            background: 'var(--bg-surface-elevated)',
                            padding: '1rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '4px solid var(--info)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: 'var(--info)',
                              marginBottom: '0.25rem',
                            }}
                          >
                            Behavioral Competency Evaluated
                          </div>
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                            {q.intention}
                          </p>
                        </div>

                        <div
                          style={{
                            background: 'var(--bg-surface-elevated)',
                            padding: '1.25rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.9rem',
                            lineHeight: 1.6,
                            color: 'var(--text-primary)',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary)' }}>
                            STAR Response Guide:
                          </div>
                          {q.answer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: 14-DAY ROADMAP */}
          {activeTab === 'roadmap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {report.preparationPlan?.map((day) => (
                <div key={day.day} className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                        Day {day.day}
                      </span>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{day.focus}</h4>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {day.tasks?.map((task, taskIdx) => {
                      const taskKey = `day_${day.day}_task_${taskIdx}`;
                      const isDone = !!completedTasks[taskKey];

                      return (
                        <div
                          key={taskIdx}
                          onClick={() => handleToggleTask(taskKey)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--radius-md)',
                            background: isDone ? 'var(--success-bg)' : 'var(--bg-surface-elevated)',
                            border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                          }}
                        >
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '6px',
                              border: `2px solid ${isDone ? 'var(--success)' : 'var(--border-strong)'}`,
                              background: isDone ? 'var(--success)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {isDone && <Check size={14} color="#fff" />}
                          </div>

                          <span
                            style={{
                              fontSize: '0.88rem',
                              color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                              textDecoration: isDone ? 'line-through' : 'none',
                            }}
                          >
                            {task}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: Skill Gaps & Readiness Summary */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Skill Gaps Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <AlertTriangle size={18} color="var(--warning)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Identified Skill Gaps</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Required by this job description but insufficiently demonstrated in your resume:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {report.skillGaps?.map((gap, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{gap.skill}</span>
                  <span
                    className={`badge ${
                      gap.severity === 'high'
                        ? 'badge-danger'
                        : gap.severity === 'medium'
                        ? 'badge-warning'
                        : 'badge-primary'
                    }`}
                  >
                    {gap.severity}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                navigate(
                  `/app/coach?prompt=${encodeURIComponent(
                    `How should I bridge my skill gaps for ${report.title || 'this role'}?`
                  )}`
                )
              }
              className="btn btn-outline btn-sm"
              style={{ width: '100%', marginTop: '1.25rem', gap: '0.4rem' }}
            >
              <Bot size={15} />
              <span>Ask Coach to Explain Gaps</span>
            </button>
          </div>

          {/* Quick Mock Interview Trigger Card */}
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
              border: '1px solid var(--border-hover)',
            }}
          >
            <Sparkles size={24} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Simulate Live Interview
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Put your knowledge to the test with our AI Interviewer for this exact position.
            </p>
            <button
              onClick={() =>
                navigate(
                  `/app/mock-interview?role=${encodeURIComponent(report.title || 'Software Engineer')}`
                )
              }
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
            >
              <span>Launch Mock Interview</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .report-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Interview;