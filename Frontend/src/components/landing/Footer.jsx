import { useNavigate } from 'react-router';
import { GraduationCap, Heart } from 'lucide-react';
import { useAuth } from '../../Features/auth/hooks/useAuth';

export const Footer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLink = (path, isAnchor = false) => {
    if (isAnchor) {
      const el = document.querySelector(path);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--lp-border)',
        padding: '5rem 0 3rem',
        color: 'var(--lp-text-dark)',
        position: 'relative',
      }}
    >
      <div className="lp-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: '3rem',
            marginBottom: '4rem',
          }}
          className="footer-grid"
        >
          {/* Brand Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--lp-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GraduationCap size={22} color="#ffffff" strokeWidth={2.2} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-lp-heading)',
                  fontWeight: 800,
                  fontSize: '1.35rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Kaushal <span style={{ color: 'var(--lp-primary)' }}>AI</span>
              </span>
            </div>

            <p style={{ color: 'var(--lp-text-muted)', fontSize: '0.94rem', lineHeight: 1.6, margin: 0, maxWidth: '320px' }}>
              Your AI-powered career companion. Helping every student become more confident, skilled, and
              job-ready, regardless of academic background.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#F8F2EC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--lp-text-dark)',
                  transition: 'background-color 0.2s',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#F8F2EC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--lp-text-dark)',
                  transition: 'background-color 0.2s',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#F8F2EC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--lp-text-dark)',
                  transition: 'background-color 0.2s',
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Product */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--lp-text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Product
            </span>
            <a href="#features" onClick={(e) => { e.preventDefault(); handleLink('#features', true); }} style={{ color: 'var(--lp-text-muted)', fontSize: '0.9rem' }}>
              Features
            </a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleLink('#how-it-works', true); }} style={{ color: 'var(--lp-text-muted)', fontSize: '0.9rem' }}>
              How It Works
            </a>
            <button onClick={() => handleLink('/app/coach')} style={{ textAlign: 'left', color: 'var(--lp-text-muted)', fontSize: '0.9rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              AI Coach
            </button>
            <button onClick={() => handleLink('/app/mock-interview')} style={{ textAlign: 'left', color: 'var(--lp-text-muted)', fontSize: '0.9rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              Mock Interviews
            </button>
            <button onClick={() => handleLink('/app/resume-analyzer')} style={{ textAlign: 'left', color: 'var(--lp-text-muted)', fontSize: '0.9rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              Resume Analyzer
            </button>
          </div>

          {/* Column 2: Resources */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--lp-text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Resources
            </span>
            <button onClick={() => handleLink('/app/roadmap')} style={{ textAlign: 'left', color: 'var(--lp-text-muted)', fontSize: '0.9rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              Career Tips
            </button>
            <button onClick={() => handleLink('/app/question-bank')} style={{ textAlign: 'left', color: 'var(--lp-text-muted)', fontSize: '0.9rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              Interview Preparation
            </button>
            <button onClick={() => handleLink('/app/dashboard')} style={{ textAlign: 'left', color: 'var(--lp-text-muted)', fontSize: '0.9rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              Learning Resources
            </button>
          </div>

          {/* Column 3: Company */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--lp-text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Company
            </span>
            <a href="#why-kaushal" onClick={(e) => { e.preventDefault(); handleLink('#why-kaushal', true); }} style={{ color: 'var(--lp-text-muted)', fontSize: '0.9rem' }}>
              About Kaushal AI
            </a>
            <a href="mailto:support@kaushal-ai.internal" style={{ color: 'var(--lp-text-muted)', fontSize: '0.9rem' }}>
              Contact
            </a>
          </div>

          {/* Column 4: Legal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--lp-text-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Legal
            </span>
            <span style={{ color: 'var(--lp-text-muted)', fontSize: '0.9rem', cursor: 'default' }}>
              Privacy Policy
            </span>
            <span style={{ color: 'var(--lp-text-muted)', fontSize: '0.9rem', cursor: 'default' }}>
              Terms of Service
            </span>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div
          style={{
            borderTop: '1px solid var(--lp-border-subtle)',
            paddingTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.86rem',
            color: 'var(--lp-text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} Kaushal AI. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Crafted with</span>
            <Heart size={14} color="var(--lp-primary)" fill="var(--lp-primary)" />
            <span>for students & job seekers across all disciplines.</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
