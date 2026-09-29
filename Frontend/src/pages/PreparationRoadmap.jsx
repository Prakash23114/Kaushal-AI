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
  Award
} from 'lucide-react';

const ROADMAP_DATA = [
  {
    day: 1,
    focus: 'JavaScript Core & Execution Context',
    objectives: 'Understand call stack, execution context phases, hoisting, and primitive vs reference types.',
    tasks: [
      'Revise memory creation phase and code execution phase',
      'Code 3 closure examples demonstrating data encapsulation',
      'Explain pass-by-value vs pass-by-reference in interviews'
    ],
    drillQuestion: 'Explain the difference between undefined, null, and undeclared.'
  },
  {
    day: 2,
    focus: 'Advanced JavaScript & Async Engine',
    objectives: 'Master Event Loop, Microtasks vs Macrotasks, Promises, and async/await error handling.',
    tasks: [
      'Trace Promise microtask queue vs setTimeout macrotask order',
      'Implement a simple Promise polyfill or Promise.all implementation',
      'Review prototypal inheritance and prototype chain'
    ],
    drillQuestion: 'Why does Promise.then() execute before setTimeout(..., 0)?'
  },
  {
    day: 3,
    focus: 'React Fundamentals & Component Lifecycle',
    objectives: 'Master JSX compilation, Virtual DOM, useState, useEffect dependencies, and cleanup functions.',
    tasks: [
      'Explain why mutating state directly is an anti-pattern',
      'Write an effect with abort controller cleanup on component unmount',
      'Review controlled vs uncontrolled form inputs'
    ],
    drillQuestion: 'What causes memory leaks in useEffect and how do you prevent them?'
  },
  {
    day: 4,
    focus: 'Advanced React & State Management',
    objectives: 'Deep dive into useMemo, useCallback, Context API, custom hooks, and state machine patterns.',
    tasks: [
      'Build a custom useFetch or useDebounce hook with caching',
      'Benchmark when useMemo causes more overhead than it saves',
      'Explain how React 18/19 concurrent rendering optimizes rendering'
    ],
    drillQuestion: 'When would you pick Context API vs Zustand or Redux Toolkit?'
  },
  {
    day: 5,
    focus: 'Node.js Internals & Event Loop',
    objectives: 'Understand libuv thread pool, streams, buffers, and non-blocking I/O architectures.',
    tasks: [
      'Explain how Node handles thousands of concurrent I/O connections',
      'Create a readable and writable stream pipeline for large files',
      'Analyze cluster mode and worker threads for CPU-bound tasks'
    ],
    drillQuestion: 'How does Node.js achieve high concurrency if it runs on a single thread?'
  },
  {
    day: 6,
    focus: 'MongoDB & Database Architecture',
    objectives: 'Master document schemas, compound indexes, ESR rule, aggregations, and query optimization.',
    tasks: [
      'Run explain("executionStats") on an unindexed vs indexed query',
      'Construct a 3-stage aggregation pipeline ($match, $group, $sort)',
      'Review optimistic vs pessimistic locking'
    ],
    drillQuestion: 'Explain the ESR (Equality, Sort, Range) rule for compound indexes.'
  },
  {
    day: 7,
    focus: 'RESTful API Design & Security',
    objectives: 'Build idempotent endpoints, status codes, JWT auth flow, rate limiting, and CORS headers.',
    tasks: [
      'Implement JWT in httpOnly secure cookies with blacklist mechanism',
      'Add express-rate-limit and helmet security headers',
      'Design clean REST API resource endpoints with versioning'
    ],
    drillQuestion: 'How do you defend against Cross-Site Scripting (XSS) and CSRF attacks in modern SPAs?'
  },
  {
    day: 8,
    focus: 'Data Structures & Algorithms (Core Patterns)',
    objectives: 'Practice two-pointers, sliding window, fast/slow pointers, and hash map lookups.',
    tasks: [
      'Solve 2 sliding window problems (e.g. longest substring without repeating chars)',
      'Solve 2 two-pointer problems (e.g. 3Sum or Trapping Rain Water)',
      'Review time and space complexity tradeoffs'
    ],
    drillQuestion: 'Explain the algorithmic intuition behind the two-pointer technique.'
  },
  {
    day: 9,
    focus: 'System Design & Scalability Principles',
    objectives: 'Learn horizontal scaling, caching strategies (Redis), CDNs, load balancing, and sharding.',
    tasks: [
      'Design a URL shortener or Notification service architecture',
      'Explain Cache-Aside vs Write-Through caching trade-offs',
      'Draw database replication and failover architecture'
    ],
    drillQuestion: 'How would you architect a caching layer to prevent cache stampedes (thundering herd)?'
  },
  {
    day: 10,
    focus: 'Project Architecture & Defense',
    objectives: 'Deeply practice explaining project structure, component boundaries, and technical trade-offs.',
    tasks: [
      'Write down high-level project architecture bullet points',
      'Prepare explanation for: "What happens if 10k users access your app?"',
      'Identify and defend your biggest technical challenge'
    ],
    drillQuestion: 'Walk me through your database schema design and why you chose it.'
  },
  {
    day: 11,
    focus: 'Behavioral & STAR Scenario Mastery',
    objectives: 'Formulate STAR answers for conflict resolution, ownership, tight deadlines, and failure.',
    tasks: [
      'Draft 3 STAR stories: a conflict, a production failure, and an ambiguous feature',
      'Practice speaking answers out loud in under 2.5 minutes',
      'Align responses with target company engineering principles'
    ],
    drillQuestion: 'Tell me about a time you made a technical mistake that broke production.'
  },
  {
    day: 12,
    focus: 'Simulated Mock Interview (Round 1)',
    objectives: 'Execute a timed 20-minute mock interview session with AI grading.',
    tasks: [
      'Complete a technical mock interview in the Mock Interview Room',
      'Review AI critique on technical accuracy and missing trade-offs',
      'Redo weak questions with the suggested better answer strategy'
    ],
    drillQuestion: 'Take today\'s full round in the AI Mock Interview Room.'
  },
  {
    day: 13,
    focus: 'Targeted Weak Area Remediation',
    objectives: 'Address identified skill gaps and refine unclear explanations with Kaushal AI Coach.',
    tasks: [
      'Review weak areas flagged on your dashboard',
      'Ask AI Coach 5 deep dive drill questions on your gap topics',
      'Refine your resume bullets with quantified impact metrics'
    ],
    drillQuestion: 'Ask AI Coach: "Test me on my weakest technical competency."'
  },
  {
    day: 14,
    focus: 'Final Full-Loop Mock & Placement Polish',
    objectives: 'Conduct final mixed technical + behavioral mock interview and finalize interview mindset.',
    tasks: [
      'Complete a full mixed mock interview round',
      'Review company research and prepare questions to ask the interviewer',
      'Ensure high confidence and structured communication'
    ],
    drillQuestion: 'What questions will you ask the engineering hiring manager at the end of the interview?'
  }
];

export const PreparationRoadmap = () => {
  const navigate = useNavigate();

  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('kaushal_global_roadmap_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [openDays, setOpenDays] = useState({ 1: true, 2: true });

  const totalTasks = ROADMAP_DATA.reduce((acc, curr) => acc + curr.tasks.length, 0);
  const finishedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((finishedCount / totalTasks) * 100);

  const toggleTask = (key) => {
    setCompletedTasks((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('kaushal_global_roadmap_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleDay = (day) => {
    setOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Personalized <span className="gradient-text">14-Day Interview Roadmap</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          An actionable day-by-day blueprint taking you from core fundamentals to system design, project defense, and live mock rounds.
        </p>
      </div>

      {/* Progress Tracking Banner */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem 2rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={22} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Roadmap Progress Tracker</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                {finishedCount} of {totalTasks} milestones completed
              </p>
            </div>
          </div>

          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
            {progressPercent}% Complete
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '100%',
            height: '10px',
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

      {/* 14 Days List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {ROADMAP_DATA.map((item) => {
          const isOpen = !!openDays[item.day];
          const allTasksDone = item.tasks.every((_, idx) => !!completedTasks[`day_${item.day}_task_${idx}`]);

          return (
            <div
              key={item.day}
              className="glass-card"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                borderColor: allTasksDone ? 'rgba(16, 185, 129, 0.4)' : isOpen ? 'var(--border-hover)' : 'var(--border-subtle)',
              }}
            >
              <div
                onClick={() => toggleDay(item.day)}
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: allTasksDone ? 'rgba(16, 185, 129, 0.06)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span
                    className={`badge ${allTasksDone ? 'badge-success' : 'badge-primary'}`}
                    style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}
                  >
                    Day {item.day}
                  </span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                    {item.focus}
                  </h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {allTasksDone && (
                    <span className="badge badge-success" style={{ gap: '0.3rem' }}>
                      <CheckCircle2 size={13} />
                      <span>Completed</span>
                    </span>
                  )}
                  <div style={{ color: 'var(--text-muted)' }}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
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
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                    <strong>Learning Objective:</strong> {item.objectives}
                  </p>

                  {/* Tasks Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Actionable Milestones:
                    </div>
                    {item.tasks.map((task, tIdx) => {
                      const taskKey = `day_${item.day}_task_${tIdx}`;
                      const isDone = !!completedTasks[taskKey];

                      return (
                        <div
                          key={tIdx}
                          onClick={() => toggleTask(taskKey)}
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
                              width: '18px',
                              height: '18px',
                              borderRadius: '5px',
                              border: `2px solid ${isDone ? 'var(--success)' : 'var(--border-strong)'}`,
                              background: isDone ? 'var(--success)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {isDone && <CheckCircle2 size={13} color="#fff" />}
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

                  {/* Daily Drill Prompt & AI Bridge */}
                  <div
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                        Daily Interview Drill
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.drillQuestion}</div>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/app/coach?prompt=${encodeURIComponent(
                            `I am on Day ${item.day} of my interview prep roadmap (${item.focus}). Drill me on this question: "${item.drillQuestion}"`
                          )}`
                        )
                      }
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.4rem' }}
                    >
                      <Bot size={15} />
                      <span>Practice in AI Coach</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreparationRoadmap;
