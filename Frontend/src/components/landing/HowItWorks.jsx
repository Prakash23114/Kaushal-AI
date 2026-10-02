import {
  Sparkles
} from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: 1,
      title: 'Create Your Account',
      subtitle: 'Sign up and set your goals.',
      color: '#C94F2D',
      badgeBg: '#C94F2D',
    },
    {
      num: 2,
      title: 'Explore AI Tools',
      subtitle: 'Use mock interviews, resume analyzer and more.',
      color: '#C94F2D',
      badgeBg: '#C94F2D',
    },
    {
      num: 3,
      title: 'Track and Improve',
      subtitle: 'Get feedback and see your progress.',
      color: '#C94F2D',
      badgeBg: '#C94F2D',
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: '3.75rem 0 4.5rem',
        backgroundColor: 'var(--lp-bg)',
        position: 'relative',
      }}
    >
      <div className="lp-container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--lp-peach)',
              border: '1px solid var(--lp-primary-border)',
              borderRadius: '9999px',
              padding: '0.3rem 0.85rem',
              marginBottom: '0.65rem',
            }}
          >
            <Sparkles size={13} color="var(--lp-primary)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--lp-primary)' }}>
              How It Works
            </span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 2.8vw, 2.3rem)',
              fontWeight: 800,
              color: 'var(--lp-text-dark)',
              margin: 0,
            }}
          >
            Get Started in 3 Simple Steps
          </h2>
        </div>

        {/* 3 Step Flow with Numbers and Connecting Line */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2.5rem',
            position: 'relative',
            alignItems: 'center',
          }}
          className="how-it-works-grid"
        >
          {/* Connecting Curved Arrow Dotted Line */}
          <div
            className="how-it-works-line"
            style={{
              position: 'absolute',
              top: '20px',
              left: '18%',
              right: '18%',
              height: '2px',
              borderTop: '2px dashed #E2C7B6',
              zIndex: 0,
            }}
          />

          {steps.map((step) => {
            return (
              <div
                key={step.num}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  backgroundColor: '#FFFFFF',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '16px',
                  border: '1.5px solid var(--lp-border)',
                  boxShadow: '0 2px 8px rgba(23, 32, 51, 0.04)',
                }}
              >
                {/* Numbered Terracotta Pill Circle */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: step.badgeBg,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(201, 79, 45, 0.25)',
                  }}
                >
                  {step.num}
                </div>

                {/* Content */}
                <div>
                  <h3
                    style={{
                      fontSize: '1.08rem',
                      fontWeight: 800,
                      color: 'var(--lp-text-dark)',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--lp-text-muted)',
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .how-it-works-line {
            display: none !important;
          }
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
