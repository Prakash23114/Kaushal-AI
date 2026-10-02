import {
  Code2,
  Cpu,
  Layers,
  FileCode,
  Terminal,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../Features/auth/hooks/useAuth';

export const WhyKaushal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const techFeatures = [
    {
      title: 'DSA & Coding Explanation',
      desc: 'Practice articulating your algorithmic thoughts, time-space complexities, and edge cases clearly out loud.',
      icon: Terminal,
      color: '#C94F2D',
      bg: '#FFF2EB',
    },
    {
      title: 'Project Architecture Defense',
      desc: 'Learn to defend tech stack trade-offs, database schemas, API design, and performance optimizations like a senior engineer.',
      icon: Layers,
      color: '#2563EB',
      bg: '#F2F7FD',
    },
    {
      title: 'Tech ATS Resume Scans',
      desc: 'Ensure your projects, GitHub repositories, programming languages, and metric-driven bullet points parse cleanly.',
      icon: FileCode,
      color: '#347C42',
      bg: '#F3FAF5',
    },
    {
      title: 'STAR Technical Behavioral',
      desc: 'Master behavioral rounds for tech teams: production outages, code reviews, agile sprints, and team disagreements.',
      icon: Cpu,
      color: '#D97706',
      bg: '#FEF9EC',
    },
  ];

  return (
    <section
      id="why-kaushal"
      style={{
        padding: '4rem 0 4.5rem',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--lp-border)',
        borderBottom: '1px solid var(--lp-border)',
        position: 'relative',
      }}
    >
      <div className="lp-container">
        {/* Section Header */}
        <div style={{ maxWidth: '680px', marginBottom: '2.5rem' }}>
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
            <Code2 size={13} color="var(--lp-primary)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--lp-primary)' }}>
              Built for Engineering & Tech Students
            </span>
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 2.8vw, 2.3rem)',
              fontWeight: 800,
              color: 'var(--lp-text-dark)',
              margin: '0 0 0.5rem',
            }}
          >
            Engineered to Crack Technical Interviews
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--lp-text-muted)', margin: 0, lineHeight: 1.5 }}>
            From Data Structures and System Design to project defense and behavioral screening, Kaushal AI
            gives technical candidates the exact preparation needed for top software engineering roles.
          </p>
        </div>

        {/* 4 Tech Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem',
            marginBottom: '3rem',
          }}
          className="why-tech-grid"
        >
          {techFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFDFB',
                  border: '1.5px solid var(--lp-border)',
                  borderRadius: '16px',
                  padding: '1.5rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(23, 32, 51, 0.03)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = '#E2D0BD';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--lp-border)';
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: item.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} color={item.color} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--lp-text-dark)', margin: 0 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--lp-text-muted)', margin: 0, lineHeight: 1.45 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Supporting Banner with Student Illustration */}
        <div
          style={{
            backgroundColor: '#FFF9F1',
            borderRadius: '20px',
            border: '1.5px solid var(--lp-border)',
            padding: '2rem 2.25rem',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '2rem',
            alignItems: 'center',
          }}
          className="tech-banner-grid"
        >
          <div>
            <div
              className="handwritten-note note-yellow"
              style={{
                marginBottom: '0.85rem',
                fontSize: '1.05rem',
                padding: '0.4rem 0.8rem',
              }}
            >
              Computer Science • IT • Engineering • Developers
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--lp-text-dark)' }}>
              From College Projects to Real Job Offers
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--lp-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Whether you are preparing for campus placements at major tech firms or hunting for off-campus
              SDE internships, practice with an AI mentor that understands code, architectures, and real hiring bars.
            </p>

            <button
              onClick={() => {
                if (user) navigate('/app/dashboard');
                else navigate('/register');
              }}
              className="lp-btn-primary"
              style={{ padding: '0.75rem 1.6rem', fontSize: '0.94rem' }}
            >
              <span>Start Technical Practice</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--lp-shadow-sm)' }}>
            <img
              src="/assets/diverse-students.jpg"
              alt="Engineering and Computer Science students coding and preparing together"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '14px',
              }}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .why-tech-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .tech-banner-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .why-tech-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default WhyKaushal;
