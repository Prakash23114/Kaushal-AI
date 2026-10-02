import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  X,
  Mic,
  FileSearch,
  Bot,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../Features/auth/hooks/useAuth';

export const DemoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('interview'); // 'interview' | 'resume' | 'coach'

  if (!isOpen) return null;

  const handleStart = () => {
    onClose();
    if (user) {
      navigate('/app/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(23, 32, 51, 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Modal Dialog Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 101,
          width: '100%',
          maxWidth: '820px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid var(--lp-border)',
          boxShadow: '0 25px 60px rgba(23, 32, 51, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--lp-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FCFAF7',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--lp-peach)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} color="var(--lp-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--lp-text-dark)' }}>
                Kaushal AI Interactive Tour
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--lp-text-muted)' }}>
                Experience how student career preparation becomes simple and stress-free
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close demo"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid var(--lp-border)',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--lp-text-muted)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Feature Preview Tabs */}
        <div
          style={{
            display: 'flex',
            padding: '0.75rem 1.75rem 0',
            borderBottom: '1px solid var(--lp-border)',
            gap: '1rem',
            backgroundColor: '#FFFFFF',
          }}
        >
          {[
            { id: 'interview', label: '1. AI Mock Interview', icon: Mic },
            { id: 'resume', label: '2. Resume Diagnostic', icon: FileSearch },
            { id: 'coach', label: '3. AI Career Coach', icon: Bot },
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
                  padding: '0.65rem 0.5rem',
                  border: 'none',
                  borderBottom: `2.5px solid ${isActive ? 'var(--lp-primary)' : 'transparent'}`,
                  color: isActive ? 'var(--lp-primary)' : 'var(--lp-text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Interactive Content Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto' }}>
          {activeTab === 'interview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  backgroundColor: '#FFF7F2',
                  border: '1px solid #FAD8C7',
                  borderRadius: '14px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--lp-primary)', marginBottom: '0.35rem' }}>
                  AI INTERVIEWER QUESTION
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--lp-text-dark)' }}>
                  "Tell me about a time when a project or assignment did not go according to plan. How did you adapt?"
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#F8FAF9',
                  border: '1px solid #DCE7DF',
                  borderRadius: '14px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2E7D32' }}>
                    REAL-TIME AI CRITIQUE & STAR SCORE
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2E7D32' }}>
                    Score: 8.5 / 10
                  </span>
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--lp-text-secondary)', lineHeight: 1.55 }}>
                  <strong>Strengths:</strong> Clear problem framing and quantifiable result.
                  <br />
                  <strong>Tip for Improvement:</strong> Spend 15 seconds more explaining the specific decisions you personally made, rather than using 'we'.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#F2F8FD',
                    border: '1px solid #D0E3FA',
                    borderRadius: '14px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563EB', marginBottom: '0.35rem' }}>
                    ATS MATCH SCORE
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2563EB' }}>
                    86%
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--lp-text-muted)' }}>
                    High candidate compatibility with entry-level and campus job requirements.
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#FEFAF0',
                    border: '1px solid #F7E7BE',
                    borderRadius: '14px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#B07512', marginBottom: '0.35rem' }}>
                    ACTIONABLE SUGGESTIONS
                  </div>
                  <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--lp-text-secondary)', lineHeight: 1.5 }}>
                    <li>Add 2 bullet points emphasizing metric outcomes.</li>
                    <li>Align skills with keywords from job posting.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'coach' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#EBE0D5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  You
                </div>
                <div
                  style={{
                    backgroundColor: '#F8F4EE',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '14px 14px 14px 2px',
                    fontSize: '0.92rem',
                    color: 'var(--lp-text-dark)',
                    maxWidth: '80%',
                  }}
                >
                  "I'm from a Commerce background applying for Business Analyst roles. How do I answer technical rounds?"
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--lp-peach)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={18} color="var(--lp-primary)" />
                </div>
                <div
                  style={{
                    backgroundColor: '#FFF9F4',
                    border: '1px solid var(--lp-primary-border)',
                    padding: '1rem 1.25rem',
                    borderRadius: '14px 14px 2px 14px',
                    fontSize: '0.92rem',
                    color: 'var(--lp-text-dark)',
                    lineHeight: 1.55,
                    maxWidth: '85%',
                  }}
                >
                  "Focus on data interpretation and problem solving! Highlight your Excel, SQL, and business metrics experience. Interviewers want to see how you derive insights from numbers to drive decisions."
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid var(--lp-border)',
            backgroundColor: '#FAF5EE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--lp-text-muted)' }}>
            <CheckCircle2 size={16} color="var(--lp-primary)" />
            <span>Ready to try your first mock interview for free?</span>
          </div>

          <button
            onClick={handleStart}
            className="lp-btn-primary"
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.94rem' }}
          >
            <span>{user ? 'Open Dashboard' : 'Get Started Free'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
