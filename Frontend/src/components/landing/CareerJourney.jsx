import {
  Compass,
  BookOpen,
  Mic,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../Features/auth/hooks/useAuth';

export const CareerJourney = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const journeySteps = [
    {
      num: '01',
      title: 'Discover Your Skills',
      desc: 'Upload your CV or take a quick diagnostic assessment to map your current strengths and role gap.',
      icon: Compass,
      color: '#C94F2D',
      bg: '#FFF0E8',
      border: '#F8D9C8',
    },
    {
      num: '02',
      title: 'Build Your Knowledge',
      desc: 'Receive a personalized 14-day study roadmap packed with topic drilldowns and question banks.',
      icon: BookOpen,
      color: '#B07512',
      bg: '#FEFAF0',
      border: '#F7E7BE',
    },
    {
      num: '03',
      title: 'Practice With AI',
      desc: 'Simulate realistic behavioral & technical interview rounds with instantaneous, gentle AI feedback.',
      icon: Mic,
      color: '#347C42',
      bg: '#F4FAF5',
      border: '#D2EDD8',
    },
    {
      num: '04',
      title: 'Improve Your Confidence',
      desc: 'Refine your phrasing, eliminate hesitation, and master the STAR method until responses feel natural.',
      icon: TrendingUp,
      color: '#2563EB',
      bg: '#F2F7FD',
      border: '#D0E3FA',
    },
    {
      num: '05',
      title: 'Get Job Ready',
      desc: 'Reach 85%+ interview readiness and download an ATS-compliant resume tuned for recruiter algorithms.',
      icon: Award,
      color: '#7C3AED',
      bg: '#F5F3FF',
      border: '#E9D8FD',
    },
  ];

  return (
    <section
      id="career-journey"
      style={{
        padding: '5.5rem 0 6rem',
        backgroundColor: 'var(--lp-bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="lp-container">
        {/* Header */}
        <div className="lp-section-header">
          <div className="lp-section-badge">
            <Sparkles size={14} />
            <span>The Career Roadmap</span>
          </div>
          <h2>Your Journey to Job Readiness</h2>
          <p>
            A calm, predictable step-by-step path that turns interview anxiety into natural confidence.
          </p>
        </div>

        {/* 5-Step Horizontal Flow with Connecting Pathway */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1.25rem',
            position: 'relative',
            marginTop: '2rem',
          }}
          className="journey-steps-grid"
        >
          {/* Desktop Connecting Line */}
          <div
            className="journey-connecting-path"
            style={{
              position: 'absolute',
              top: '32px',
              left: '10%',
              right: '10%',
              height: '3px',
              backgroundColor: 'var(--lp-border)',
              zIndex: 0,
            }}
          />

          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {/* Milestone Node */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: `3px solid ${step.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(23, 32, 51, 0.08)',
                    marginBottom: '1.25rem',
                    transition: 'transform 0.2s',
                  }}
                  className="journey-node"
                >
                  <Icon size={24} color={step.color} />
                </div>

                {/* Card Detail */}
                <div
                  className="lp-card"
                  style={{
                    width: '100%',
                    padding: '1.5rem 1.1rem',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid var(--lp-border)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: '220px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: step.color,
                      letterSpacing: '0.05em',
                      marginBottom: '0.35rem',
                    }}
                  >
                    PHASE {step.num}
                  </span>

                  <h3
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      marginBottom: '0.5rem',
                      color: 'var(--lp-text-dark)',
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.84rem',
                      color: 'var(--lp-text-muted)',
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div
          style={{
            marginTop: '3.5rem',
            textAlign: 'center',
          }}
        >
          <button
            onClick={() => {
              if (user) navigate('/app/dashboard');
              else navigate('/register');
            }}
            className="lp-btn-secondary"
            style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem',
            }}
          >
            <span>Begin Phase 01: Discover Your Skills</span>
            <ArrowRight size={17} color="var(--lp-primary)" />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .journey-connecting-path {
            display: none !important;
          }
          .journey-steps-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 640px) {
          .journey-steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .journey-node:hover {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
};

export default CareerJourney;
