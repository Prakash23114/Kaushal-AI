import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  History,
  Sparkles,
  Clock,
  ExternalLink,
  PlusCircle,
  Search,
  Printer,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Code2,
  MessageSquare
} from 'lucide-react';
import { useInterview } from '../Features/interview/hooks/useInterview';
import { getAllMockSessions } from '../Features/interview/services/interview.api';

export const MyInterviews = () => {
  const { reports, getReports, loading: reportsLoading, getResumePdf } = useInterview();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mock'); // 'mock' | 'strategies'
  const [mockSessions, setMockSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  useEffect(() => {
    getReports();
    loadMockSessions();
  }, []);

  const loadMockSessions = async () => {
    try {
      setSessionsLoading(true);
      const res = await getAllMockSessions();
      if (res && res.sessions) {
        setMockSessions(res.sessions);
      }
    } catch (err) {
      console.error('Failed to load mock sessions:', err);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleDownloadPdf = async (e, reportId) => {
    e.stopPropagation();
    setDownloadingId(reportId);
    try {
      await getResumePdf(reportId);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredReports = (reports || []).filter((r) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (r.title && r.title.toLowerCase().includes(query)) ||
      (r.jobDescription && r.jobDescription.toLowerCase().includes(query))
    );
  });

  const filteredSessions = (mockSessions || []).filter((s) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (s.role && s.role.toLowerCase().includes(query)) ||
      (s.interviewType && s.interviewType.toLowerCase().includes(query)) ||
      (s.feedback && s.feedback.toLowerCase().includes(query))
    );
  });

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            My Interview <span className="gradient-text">History</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Review all actual mock interview sessions, questions, evaluations, and saved strategies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/app/mock-interview')}
            className="btn btn-primary"
            style={{ gap: '0.5rem' }}
          >
            <PlusCircle size={16} />
            <span>New Mock Interview</span>
          </button>
          <button
            onClick={() => navigate('/app/new-interview')}
            className="btn btn-outline"
            style={{ gap: '0.5rem' }}
          >
            <FileText size={16} />
            <span>New Strategy</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setActiveTab('mock')}
          className={`btn btn-sm ${activeTab === 'mock' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ gap: '0.5rem' }}
        >
          <Award size={15} />
          <span>Mock & Defense Sessions ({mockSessions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('strategies')}
          className={`btn btn-sm ${activeTab === 'strategies' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ gap: '0.5rem' }}
        >
          <FileText size={15} />
          <span>Role Strategy Reports ({reports?.length || 0})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ position: 'relative' }}>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'mock' ? "Search mock sessions by role, type, or feedback..." : "Search saved strategies by role or keyword..."}
            className="input-field"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* CONTENT: MOCK SESSIONS */}
      {activeTab === 'mock' && (
        <>
          {sessionsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Sparkles size={32} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Loading interview sessions...</p>
            </div>
          ) : filteredSessions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredSessions.map((session) => {
                const isExpanded = expandedSessionId === session._id;
                const score = session.score || 0;
                const isHigh = score >= 80;
                const isMid = score >= 60;
                const scoreBadgeClass = isHigh ? 'badge-success' : isMid ? 'badge-primary' : 'badge-warning';

                return (
                  <div
                    key={session._id}
                    className="glass-card"
                    style={{
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-xl)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem',
                      transition: 'all var(--transition-normal)',
                      border: isExpanded ? '1px solid var(--primary)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                          <span className={`badge ${scoreBadgeClass}`} style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                            {score}% Score
                          </span>
                          <span className="badge badge-outline" style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                            {session.interviewType || 'Mock Interview'}
                          </span>
                          <span className="badge badge-ghost" style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                            {session.difficulty || 'Medium'}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {session.role || 'Software Engineer'}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Conducted on {new Date(session.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      {/* Sub-Scores Pill Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', minWidth: '280px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Technical</div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>{session.technicalScore ?? score}%</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Comm.</div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{session.communicationScore ?? score}%</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Behavioral</div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--warning)' }}>{session.behavioralScore ?? score}%</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Project</div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>{session.projectScore ?? score}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Overall Feedback */}
                    {session.feedback && (
                      <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderLeft: '3px solid var(--primary)', padding: '0.75rem 1rem', borderRadius: '4px' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>AI Feedback Summary:</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {session.feedback}
                        </div>
                      </div>
                    )}

                    {/* Questions Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {session.questions?.length || 0} Questions Answered & Evaluated
                      </span>
                      <button
                        onClick={() => setExpandedSessionId(isExpanded ? null : session._id)}
                        className="btn btn-ghost btn-sm"
                        style={{ gap: '0.4rem', fontSize: '0.82rem' }}
                      >
                        <span>{isExpanded ? 'Hide Questions & Answers' : 'Review Questions & Answers'}</span>
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                    </div>

                    {/* Expandable Q&A Detailed Breakdown */}
                    {isExpanded && session.questions && session.questions.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-subtle)' }}>
                        {session.questions.map((q, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-md)',
                              padding: '1rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.65rem'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                                Q{idx + 1}. {q.question}
                              </div>
                              {q.evaluation?.score !== undefined && (
                                <span className={`badge ${q.evaluation.score >= 80 ? 'badge-success' : q.evaluation.score >= 60 ? 'badge-primary' : 'badge-warning'}`} style={{ fontSize: '0.75rem', flexShrink: 0 }}>
                                  {q.evaluation.score}%
                                </span>
                              )}
                            </div>

                            {q.userAnswer && (
                              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Candidate Answer: </span>
                                {q.userAnswer}
                              </div>
                            )}

                            {q.evaluation?.feedback && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Gemini Evaluation: </span>
                                {q.evaluation.feedback}
                              </div>
                            )}

                            {q.evaluation?.missingPoints && q.evaluation.missingPoints.length > 0 && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--warning)', marginTop: '0.2rem' }}>
                                <span style={{ fontWeight: 600 }}>Missing Concepts: </span>
                                {Array.isArray(q.evaluation.missingPoints) ? q.evaluation.missingPoints.join(', ') : q.evaluation.missingPoints}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="glass-card"
              style={{
                padding: '3rem',
                textAlign: 'center',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <History size={36} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                No interviews yet.
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                {searchQuery ? 'Try clearing your search query.' : 'Complete your first mock interview or project defense to see your performance history.'}
              </p>
              <button onClick={() => navigate('/app/mock-interview')} className="btn btn-primary btn-sm">
                <PlusCircle size={15} />
                <span>Start Mock Interview</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* CONTENT: STRATEGY REPORTS */}
      {activeTab === 'strategies' && (
        <>
          {reportsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Sparkles size={32} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Loading interview strategies...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {filteredReports.map((r) => {
                const isHigh = r.matchScore >= 80;
                const isMid = r.matchScore >= 60;
                const scoreBadgeClass = isHigh ? 'badge-success' : isMid ? 'badge-primary' : 'badge-warning';

                return (
                  <div
                    key={r._id}
                    onClick={() => navigate(`/app/interview/${r._id}`)}
                    className="glass-card"
                    style={{
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      transition: 'all var(--transition-normal)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                        <span className={`badge ${scoreBadgeClass}`} style={{ fontSize: '0.8rem' }}>
                          {r.matchScore}% Match
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--text-primary)' }}>
                        {r.title || 'Untitled Target Role'}
                      </h3>

                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          marginTop: '0.5rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {r.jobDescription?.slice(0, 140)}...
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid var(--border-subtle)',
                      }}
                    >
                      <button
                        onClick={(e) => handleDownloadPdf(e, r._id)}
                        disabled={downloadingId === r._id}
                        className="btn btn-ghost btn-sm"
                        style={{ gap: '0.35rem', fontSize: '0.8rem' }}
                        title="Download ATS Resume"
                      >
                        <Printer size={14} />
                        <span>{downloadingId === r._id ? 'Generating...' : 'PDF Resume'}</span>
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)' }}>
                        <span>Open Strategy</span>
                        <ChevronRight size={15} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="glass-card"
              style={{
                padding: '3rem',
                textAlign: 'center',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <History size={36} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                No interview strategies found
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                {searchQuery ? 'Try clearing your search query.' : 'Create your first interview strategy using AI analysis.'}
              </p>
              <button onClick={() => navigate('/app/new-interview')} className="btn btn-primary btn-sm">
                <PlusCircle size={15} />
                <span>Create New Strategy</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyInterviews;
