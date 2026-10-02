import { useNavigate } from 'react-router';
import {
  Mic,
  FileText,
  Bot,
  BarChart3,
  GraduationCap,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../Features/auth/hooks/useAuth';

export const FeaturesSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFeatureClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      id: 'mock-interviews',
      title: 'Mock Interviews',
      desc: 'Practice with AI, get real-time feedback and improve your communication skills.',
      icon: Mic,
      path: '/app/mock-interview',
      accentColor: '#C94F2D',
      bgCard: '#FFF2EB',
      borderCard: '#FAD8C7',
      iconBg: '#FFE4D6',
    },
    {
      id: 'resume-analyzer',
      title: 'Resume Analyzer',
      desc: 'Get instant AI feedback and improve your resume for better opportunities.',
      icon: FileText,
      path: '/app/resume-analyzer',
      accentColor: '#347C42',
      bgCard: '#F3FAF5',
      borderCard: '#D2EDD8',
      iconBg: '#E1F5E6',
    },
    {
      id: 'ai-coach',
      title: 'AI Career Coach',
      desc: 'Personalized guidance for skills, career paths and job opportunities.',
      icon: Bot,
      path: '/app/coach',
      accentColor: '#0E7A6B',
      bgCard: '#F0FAF8',
      borderCard: '#CBEBE6',
      iconBg: '#DCF5F1',
    },
    {
      id: 'skill-assessment',
      title: 'Skill Assessment',
      desc: 'Identify your strengths and weaknesses with AI-powered tests.',
      icon: BarChart3,
      path: '/app/dashboard',
      accentColor: '#B83256',
      bgCard: '#FDF2F5',
      borderCard: '#F8CFD9',
      iconBg: '#FCE0E7',
    },
    {
      id: 'learning-path',
      title: 'Learning Path',
      desc: 'Get a personalized learning roadmap based on your goals.',
      icon: GraduationCap,
      path: '/app/roadmap',
      accentColor: '#2563EB',
      bgCard: '#F2F7FD',
      borderCard: '#D0E3FA',
      iconBg: '#E0EEFD',
    },
    {
      id: 'interview-questions',
      title: 'Interview Questions',
      desc: 'Practice with industry-specific questions.',
      icon: HelpCircle,
      path: '/app/question-bank',
      accentColor: '#D97706',
      bgCard: '#FEF9EC',
      borderCard: '#FDE4A0',
      iconBg: '#FEF0CB',
    },
    {
      id: 'resource-library',
      title: 'Resource Library',
      desc: 'Access curated resources, cheat sheets and study materials.',
      icon: BookOpen,
      path: '/app/dashboard',
      accentColor: '#C94F2D',
      bgCard: '#FFF4EE',
      borderCard: '#FADCCE',
      iconBg: '#FFE9DE',
    },
  ];

  return (
    <section
      id="features"
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
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
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
                What You Can Do
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
              Everything You Need to <br className="features-break" />
              Prepare for Your Career
            </h2>
          </div>

          <div style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <p style={{ fontSize: '0.92rem', color: 'var(--lp-text-muted)', margin: 0, lineHeight: 1.5 }}>
              From mock interviews to resume analysis, Kaushal AI gives you the tools and guidance to
              build real skills and stay ahead.
            </p>
            <div
              className="handwritten-arrow-tag"
              style={{
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--lp-primary)',
              }}
            >
              <span>All tools in one place</span>
              <span style={{ fontSize: '1.2rem' }}>✍️</span>
            </div>
          </div>
        </div>

        {/* 7 Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '14px',
          }}
          className="features-strip-grid"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => handleFeatureClick(feature.path)}
                style={{
                  backgroundColor: feature.bgCard,
                  border: `1.5px solid ${feature.borderCard}`,
                  borderRadius: '16px',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  boxShadow: '0 2px 6px rgba(23, 32, 51, 0.02)',
                  minHeight: '215px',
                }}
                className="feature-card-item"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(23, 32, 51, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(23, 32, 51, 0.02)';
                }}
              >
                <div>
                  {/* Icon */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: feature.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${feature.borderCard}`,
                      marginBottom: '1rem',
                    }}
                  >
                    <Icon size={20} color={feature.accentColor} strokeWidth={2.2} />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      marginBottom: '0.45rem',
                      color: 'var(--lp-text-dark)',
                      lineHeight: 1.25,
                    }}
                  >
                    {feature.title}
                  </h3>

                  {/* Short Description */}
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--lp-text-secondary)',
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    {feature.desc}
                  </p>
                </div>

                {/* Circular Arrow Button */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginTop: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${feature.borderCard}`,
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.04)',
                      transition: 'transform 0.2s',
                    }}
                    className="feature-arrow-btn"
                  >
                    <ArrowRight size={13} color={feature.accentColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .features-strip-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .features-strip-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .features-break {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .features-strip-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .feature-card-item:hover .feature-arrow-btn {
          transform: translateX(2px);
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
