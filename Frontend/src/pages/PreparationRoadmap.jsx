import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Compass,
  CheckCircle2,
  Circle,
  Sparkles,
  Bot,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  PlusCircle
} from 'lucide-react';
import { getPersonalizedRoadmap } from '../Features/interview/services/interview.api';

export const PreparationRoadmap = () => {
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRoadmap, setHasRoadmap] = useState(true);
  const [emptyMessage, setEmptyMessage] = useState('');
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('kaushal_roadmap_done_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [expandedDays, setExpandedDays] = useState({ 1: true });

  useEffect(() => {
    let isMounted = true;
    const fetchRoadmap = async () => {
      try {
        const res = await getPersonalizedRoadmap();
        if (isMounted) {
          if (res?.hasRoadmap && res?.roadmap?.days?.length > 0) {
            setRoadmapData(res.roadmap);
            setHasRoadmap(true);
          } else {
            setHasRoadmap(false);
            setEmptyMessage(res?.message || 'No personalized roadmap yet. Create a strategy to generate your roadmap.');
          }
        }
      } catch (err) {
        console.error('Failed to load roadmap:', err);
        if (isMounted) {
          setHasRoadmap(false);
          setEmptyMessage('No personalized roadmap yet. Create a strategy to generate your roadmap.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRoadmap();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTask = (dayNum, taskIdx) => {
    const key = `day_${dayNum}_task_${taskIdx}`;
    const updated = { ...completedTasks, [key]: !completedTasks[key] };
    setCompletedTasks(updated);
    try {
      localStorage.setItem('kaushal_roadmap_done_tasks', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleDayExpanded = (dayNum) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const daysList = roadmapData?.days || [];
  const totalTasks = daysList.reduce((acc, d) => acc + (d.tasks?.length || 0), 0);
  const doneCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Personalized Preparation <span className="gradient-text">Roadmap</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Dynamic day-by-day technical curriculum addressing your genuine resume skill gaps and priority focus areas.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Sparkles size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Generating personalized roadmap based on your weak areas...</p>
        </div>
      ) : !hasRoadmap ? (
        /* Empty State */
        <div
          className="glass-card"
          style={{
            padding: '3.5rem 2rem',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Compass size={48} color="var(--primary)" />
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
            {emptyMessage || 'No personalized roadmap yet.'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: 0, fontSize: '0.95rem' }}>
            Upload your resume or paste a target job description to synthesize your customized preparation roadmap.
          </p>
          <button
            onClick={() => navigate('/app/new-interview')}
            className="btn btn-primary"
            style={{ marginTop: '0.5rem', gap: '0.45rem' }}
          >
            <PlusCircle size={16} />
            <span>Create Your First Strategy</span>
          </button>
        </div>
      ) : (
        <>
          {/* Progress Banner */}
          <div
            className="glass-card"
            style={{
              padding: '1.75rem 2rem',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-primary">{roadmapData.roleTitle || 'Target Role'}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {daysList.length}-Day Customized Curriculum
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                {roadmapData.summary || 'Personalized Weak Area Mastery'}
              </h3>
            </div>

            <div style={{ minWidth: '220px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Curriculum Completion</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{progressPercent}%</span>
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
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: 'var(--accent-gradient)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Days Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {daysList.map((item) => {
              const isExpanded = !!expandedDays[item.day];
              const dayTasks = item.tasks || [];
              const dayTasksDone = dayTasks.filter((_, tIdx) => completedTasks[`day_${item.day}_task_${tIdx}`]).length;
              const isDayComplete = dayTasks.length > 0 && dayTasksDone === dayTasks.length;

              return (
                <div
                  key={item.day}
                  className="glass-card"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    border: isDayComplete ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                  }}
                >
                  {/* Day Header Accordion Toggle */}
                  <div
                    onClick={() => toggleDayExpanded(item.day)}
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: isExpanded ? 'var(--bg-surface-elevated)' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: isDayComplete ? 'var(--success-bg)' : 'rgba(99, 102, 241, 0.12)',
                          color: isDayComplete ? 'var(--success)' : 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                        }}
                      >
                        {item.day}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {item.focus}
                          </span>
                          {isDayComplete && (
                            <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                              Done
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          {dayTasksDone}/{dayTasks.length} tasks completed
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                      {/* Objectives */}
                      {item.objectives && (
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                          {item.objectives}
                        </p>
                      )}

                      {/* Tasks Checkbox List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Key Action Tasks
                        </div>
                        {dayTasks.map((task, tIdx) => {
                          const taskKey = `day_${item.day}_task_${tIdx}`;
                          const isDone = !!completedTasks[taskKey];

                          return (
                            <div
                              key={tIdx}
                              onClick={() => toggleTask(item.day, tIdx)}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.65rem',
                                padding: '0.65rem 0.85rem',
                                borderRadius: 'var(--radius-sm)',
                                background: isDone ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface-elevated)',
                                border: '1px solid var(--border-subtle)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                              }}
                            >
                              <div style={{ marginTop: '2px' }}>
                                {isDone ? (
                                  <CheckCircle2 size={16} color="var(--success)" />
                                ) : (
                                  <Circle size={16} color="var(--text-muted)" />
                                )}
                              </div>
                              <span
                                style={{
                                  fontSize: '0.85rem',
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

                      {/* Drill Interview Question */}
                      {item.drillQuestion && (
                        <div
                          style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(99, 102, 241, 0.08)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                              Daily Drill Question
                            </div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {item.drillQuestion}
                            </div>
                          </div>

                          <button
                            onClick={() => navigate(`/app/coach?prompt=${encodeURIComponent(item.drillQuestion)}`)}
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '0.35rem' }}
                          >
                            <Bot size={14} />
                            <span>Ask AI Coach</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PreparationRoadmap;
