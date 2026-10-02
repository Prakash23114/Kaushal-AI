import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../Features/auth/hooks/useAuth';

export const FinalCTA = () => {
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
      style={{
        padding: '3.5rem 0 4.5rem',
        backgroundColor: 'var(--lp-bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="lp-container">
        <div
          style={{
            backgroundColor: '#FFF5EC',
            border: '1.5px solid var(--lp-border)',
            borderRadius: '24px',
            padding: '2.5rem 2.25rem',
            position: 'relative',
            boxShadow: '0 12px 30px rgba(23, 32, 51, 0.05)',
            display: 'grid',
            gridTemplateColumns: '0.9fr 1.6fr 0.8fr',
            gap: '2rem',
            alignItems: 'center',
          }}
          className="final-cta-banner-grid"
        >
          {/* Left: Illustrated Group with Sticky Note */}
          <div style={{ position: 'relative' }}>
            <div
              className="handwritten-note note-yellow"
              style={{
                position: 'absolute',
                top: '-20px',
                left: '-10px',
                zIndex: 10,
                fontSize: '0.95rem',
                padding: '0.4rem 0.75rem',
                transform: 'rotate(-4deg)',
              }}
            >
              Different Stacks <br />
              Same Goal • A Better Future
            </div>

            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--lp-shadow-sm)',
                border: '1px solid var(--lp-border)',
              }}
            >
              <img
                src="/assets/diverse-students.jpg"
                alt="Engineering students collaborating with Kaushal AI"
                style={{
                  width: '100%',
                  height: '140px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Center: Headline & Subtitle */}
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 1.95rem)',
                fontWeight: 800,
                color: 'var(--lp-text-dark)',
                marginBottom: '0.4rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
              }}
            >
              Ready to Build Your Future with{' '}
              <span style={{ color: 'var(--lp-primary)' }}>Kaushal AI?</span>
            </h2>
            <p
              style={{
                fontSize: '0.94rem',
                color: 'var(--lp-text-secondary)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Join now and get access to AI-powered tools, personalized guidance and everything you need
              to stay ahead in technical interviews.
            </p>
          </div>

          {/* Right: CTA Button & Sticky Note */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              position: 'relative',
              gap: '1rem',
            }}
            className="final-cta-right-col"
          >
            <button
              onClick={handleStart}
              className="lp-btn-primary"
              style={{
                padding: '0.9rem 1.85rem',
                fontSize: '1.02rem',
                whiteSpace: 'nowrap',
              }}
            >
              <span>Get Started Free</span>
              <ArrowRight size={17} />
            </button>

            {/* Bottom-right Sticky Note */}
            <div
              className="handwritten-note note-yellow"
              style={{
                fontSize: '1rem',
                padding: '0.45rem 0.8rem',
                lineHeight: 1.2,
                transform: 'rotate(2deg)',
                textAlign: 'left',
              }}
            >
              <div>Practice</div>
              <div>Improve</div>
              <div>Grow</div>
              <div style={{ color: 'var(--lp-primary)', fontWeight: 700 }}>Get Hired 🚀</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .final-cta-banner-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }
          .final-cta-right-col {
            alignItems: center !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FinalCTA;
