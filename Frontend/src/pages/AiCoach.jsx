import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  User,
  ArrowRight,
  HelpCircle,
  Code2,
  RefreshCw,
  Layers,
  MessageSquare
} from 'lucide-react';
import { useInterview } from '../Features/interview/hooks/useInterview';
import { askCoach } from '../Features/interview/services/interview.api';

const DEFAULT_PROMPTS = [
  'Explain my skill gaps & how to fix them',
  'Ask me a tough technical question for my role',
  'How should I explain my main project architecture?',
  'Give me realistic behavioral STAR questions',
  'Review my approach: What if 10k users access my API?',
  'What are the most common interview traps for this role?',
];

export const AiCoach = () => {
  const [searchParams] = useSearchParams();
  const { reports, getReports } = useInterview();

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('kaushal_coach_chat');
      return saved
        ? JSON.parse(saved)
        : [
            {
              role: 'assistant',
              content:
                "Hello! I am **Kaushal AI Coach**, your personal senior technical mentor. I'm here to simulate interview questions, critique your answers, review your project architecture, and guide you through skill gaps. How can I help you prepare today?",
            },
          ];
    } catch {
      return [
        {
          role: 'assistant',
          content:
            "Hello! I am **Kaushal AI Coach**, your personal senior technical mentor. How can I help you prepare today?",
        },
      ];
    }
  });

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  // Load existing reports for grounding
  useEffect(() => {
    getReports();
  }, []);

  // Check URL query parameters (e.g. ?prompt=... or ?topic=...)
  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    const topicParam = searchParams.get('topic');

    if (promptParam) {
      handleSendMessage(promptParam);
    } else if (topicParam) {
      handleSendMessage(`Can you explain ${topicParam} in depth and ask me a realistic interview question on it?`);
    }
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem('kaushal_coach_chat', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const activeReport = reports?.find((r) => r._id === selectedReportId) || reports?.[0] || null;

  const handleSendMessage = async (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend : inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const contextData = activeReport
        ? {
            targetRole: activeReport.title,
            matchScore: activeReport.matchScore,
            skillGaps: activeReport.skillGaps,
            title: activeReport.title,
            resumeSummary: activeReport.resume ? activeReport.resume.slice(0, 1000) : '',
          }
        : {};

      const response = await askCoach({
        messages: updatedMessages,
        context: contextData,
      });

      if (response && response.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'The AI coach is currently experiencing high demand. Please try asking again in a moment.',
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered a temporary connection error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    const initial = [
      {
        role: 'assistant',
        content:
          "Conversation cleared. I am ready for our next practice session! What topic or role should we focus on?",
      },
    ];
    setMessages(initial);
    localStorage.removeItem('kaushal_coach_chat');
  };

  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '280px minmax(0, 1fr)',
        gap: '1.75rem',
        height: 'calc(100vh - 120px)',
        minHeight: '600px',
      }}
      className="coach-layout"
    >
      {/* ── Left Sidebar: Grounding Context & Prompt Suggestions ── */}
      <aside
        className="glass-card"
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          overflowY: 'auto',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        {/* Context Selector */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Layers size={18} color="var(--primary)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Grounding Context</h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
            Ground the coach with one of your generated job profiles:
          </p>

          <select
            value={selectedReportId || (activeReport?._id || '')}
            onChange={(e) => setSelectedReportId(e.target.value)}
            className="input-field"
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.75rem' }}
          >
            {reports && reports.length > 0 ? (
              reports.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.title || 'Untitled'} ({r.matchScore}%)
                </option>
              ))
            ) : (
              <option value="">General Tech Context</option>
            )}
          </select>

          {activeReport && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface-elevated)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
              }}
            >
              <div>Role: <strong>{activeReport.title}</strong></div>
              <div>Match: <strong>{activeReport.matchScore}%</strong></div>
              <div>Gaps: <strong>{activeReport.skillGaps?.length || 0} identified</strong></div>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <Sparkles size={16} color="var(--accent-cyan)" />
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Suggested Drills</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {DEFAULT_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                style={{
                  textAlign: 'left',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  lineHeight: 1.4,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Clear chat action */}
        <button
          onClick={handleClearChat}
          className="btn btn-ghost btn-sm"
          style={{ width: '100%', gap: '0.4rem', color: 'var(--text-muted)' }}
        >
          <Trash2 size={15} />
          <span>Clear Conversation</span>
        </button>
      </aside>

      {/* ── Right Area: Live Chat Stream ── */}
      <section
        className="glass-card"
        style={{
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            padding: '1.15rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px var(--primary-glow)',
              }}
            >
              <Bot size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Kaushal AI Coach</h3>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                  Online
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Powered by Gemini 3.8 Flash • Contextual Interview Coaching
              </p>
            </div>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'flex-start',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    <Bot size={18} color="var(--primary)" />
                  </div>
                )}

                <div
                  style={{
                    maxWidth: '82%',
                    position: 'relative',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '1rem 1.25rem',
                    background: isUser ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                    color: isUser ? '#ffffff' : 'var(--text-primary)',
                    border: isUser ? 'none' : '1px solid var(--border-subtle)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div className="markdown-content">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>

                  {!isUser && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '0.65rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        paddingTop: '0.4rem',
                      }}
                    >
                      <button
                        onClick={() => handleCopyMessage(m.content, idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check size={13} color="var(--success)" />
                            <span style={{ color: 'var(--success)' }}>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'var(--accent-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}
                  >
                    U
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={18} color="var(--primary)" />
              </div>
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  borderRadius: '18px 18px 18px 4px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    animation: 'pulseGlow 1s infinite alternate',
                  }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Kaushal Coach is thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything (e.g. 'Review my answer to why React over Vue?')..."
              className="input-field"
              style={{ flex: 1, padding: '0.8rem 1.15rem' }}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-md)', padding: '0.8rem 1.25rem' }}
            >
              <Send size={18} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .coach-layout {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
        }
        .markdown-content pre {
          background: rgba(0, 0, 0, 0.4);
          padding: 0.85rem;
          border-radius: var(--radius-sm);
          overflow-x: auto;
          margin: 0.65rem 0;
          font-family: var(--font-mono);
          font-size: 0.85rem;
        }
        .markdown-content code {
          background: rgba(0, 0, 0, 0.3);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.85rem;
        }
        .markdown-content p {
          margin-bottom: 0.5rem;
        }
        .markdown-content ul, .markdown-content ol {
          padding-left: 1.25rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default AiCoach;
