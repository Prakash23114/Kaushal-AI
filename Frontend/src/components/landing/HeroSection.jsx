import { useNavigate } from 'react-router';
import {
  ArrowRight,
  Play,
  Lightbulb,
  Clock,
  Target,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../Features/auth/hooks/useAuth';
import HeroProductPreview from './HeroProductPreview';

export const HeroSection = ({ onOpenDemo }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate('/app/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <section
      id="hero"
      style={{
        padding: '3rem 0 3.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="lp-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.35fr',
            gap: '2.5rem',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* ── Left Column: Headline, Copy & CTAs ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 1 }}>
            {/* Small Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'var(--lp-peach)',
                border: '1px solid var(--lp-primary-border)',
                borderRadius: '9999px',
                padding: '0.3rem 0.85rem',
                width: 'fit-content',
              }}
            >
              <GraduationCap size={15} color="var(--lp-primary)" strokeWidth={2.4} />
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--lp-primary)',
                }}
              >
                For Students & Job Seekers
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 4.2vw, 3.6rem)',
                fontWeight: 800,
                lineHeight: 1.12,
                color: 'var(--lp-text-dark)',
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              Practice Today <br />
              for a Better <br />
              <span className="terracotta-highlight">
                Tomorrow.
                <svg
                  className="brush-underline"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8C45 3 130 2 197 8"
                    stroke="#C94F2D"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Supporting Text */}
            <p
              style={{
                fontSize: '1.02rem',
                color: 'var(--lp-text-secondary)',
                lineHeight: 1.55,
                margin: 0,
                maxWidth: '460px',
              }}
            >
              Kaushal AI helps you practice, learn and improve with AI-powered tools — so you can build
              real technical skills and get job ready for top engineering & tech roles.
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap',
              }}
              className="hero-cta-group"
            >
              <button
                onClick={handleStart}
                className="lp-btn-primary"
                style={{
                  padding: '0.85rem 1.85rem',
                  fontSize: '1rem',
                }}
              >
                <span>Get Started Free</span>
                <ArrowRight size={17} />
              </button>

              <button
                onClick={onOpenDemo}
                className="lp-btn-secondary"
                style={{
                  padding: '0.85rem 1.65rem',
                  fontSize: '0.98rem',
                }}
              >
                <Play size={13} color="var(--lp-primary)" fill="var(--lp-primary)" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* 3 Benefits Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--lp-border)',
              }}
              className="hero-benefits-grid"
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    backgroundColor: 'var(--lp-peach)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Lightbulb size={14} color="var(--lp-primary)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--lp-text-dark)' }}>
                    Easy to Use
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--lp-text-muted)' }}>
                    No complex setup
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    backgroundColor: 'var(--lp-green-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={14} color="var(--lp-green-dark)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--lp-text-dark)' }}>
                    Practice & Learn
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--lp-text-muted)' }}>
                    At your own pace
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    backgroundColor: 'var(--lp-yellow-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Target size={14} color="var(--lp-yellow-dark)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--lp-text-dark)' }}>
                    Career Focused
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--lp-text-muted)' }}>
                    For tech students
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Composite Visual Preview ── */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <HeroProductPreview />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
