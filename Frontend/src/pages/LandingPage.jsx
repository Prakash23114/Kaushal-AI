import React from 'react';
import { useNavigate } from 'react-router';
import {
  Sparkles,
  Bot,
  Mic,
  FileSearch,
  Briefcase,
  Compass,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Award,
  Zap,
  Star,
  Users
} from 'lucide-react';
import { useAuth } from '../Features/auth/hooks/useAuth';

export const LandingPage = () => {
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* ── 1. Modern SaaS Navbar ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px var(--primary-glow)',
            }}
          >
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
              Kaushal <span className="gradient-text">AI</span>
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              Personal AI Interview Coach
            </div>
          </div>
        </div>

        <nav
          className="landing-nav-links"
          style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.92rem', fontWeight: 500 }}
        >
          <a href="#features" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
            Features
          </a>
          <a href="#how-it-works" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
            How It Works
          </a>
          <a href="#ai-coach" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
            AI Coach
          </a>
          <a href="#mock-interview" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
            Mock Interview
          </a>
          <a href="#about" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
            About
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <button onClick={() => navigate('/app/dashboard')} className="btn btn-primary">
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn btn-ghost">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="btn btn-primary">
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── 2. Hero Section ── */}
      <section
        style={{
          padding: '5rem 2rem 4rem',
          maxWidth: '1240px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Glow ambient background effects */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '650px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 75%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.75rem',
            }}
          >
            <Sparkles size={16} color="var(--primary)" />
            <span>Next-Gen AI Interview Preparation & Coaching</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            Prepare Smarter. <span className="gradient-text">Interview Better.</span>
            <br />
            Get Hired.
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '750px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Kaushal AI uses your resume, target job description, and Gemini AI analysis to create a
            personalized interview preparation roadmap, live AI coaching, mock interviews, and tailored
            feedback.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
            }}
          >
            <button onClick={handleStart} className="btn btn-primary btn-lg">
              <Sparkles size={18} />
              <span>Start Preparing Free</span>
            </button>

            <button
              onClick={() => {
                if (user) navigate('/app/mock-interview');
                else navigate('/login');
              }}
              className="btn btn-secondary btn-lg"
            >
              <Mic size={18} />
              <span>Try AI Mock Interview</span>
            </button>
          </div>

          {/* Interactive Hero Visual Showcase */}
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-hover)',
              boxShadow: 'var(--shadow-glow)',
              textAlign: 'left',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {/* Window bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                kaushal-ai.dashboard / candidate-preview
              </div>
              <span className="badge badge-success">AI Live Engine</span>
            </div>

            {/* Dashboard Mock Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {/* Stat card 1 */}
              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Role Match</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>88%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Full Stack Engineer • Google
                </div>
              </div>

              {/* Stat card 2 */}
              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>14-Day Roadmap</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>Day 4 of 14</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Focus: React, State Management & Micro-frontends
                </div>
              </div>

              {/* Stat card 3 */}
              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI Coach Simulation</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>Active</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Evaluating technical & STAR behavioral answers
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Trusted / Highlights Bar ── */}
      <section
        style={{
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          padding: '2rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          {[
            { label: 'AI Powered', icon: Zap },
            { label: 'Personalized Strategy', icon: Award },
            { label: 'Resume Based', icon: FileSearch },
            { label: 'Job Specific', icon: Briefcase },
            { label: 'Mock Interviews', icon: Mic },
            { label: 'Progress Tracking', icon: TrendingUp },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Icon size={18} color="var(--primary)" />
                <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. How It Works ── */}
      <section id="how-it-works" style={{ padding: '6rem 2rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
            Seamless Workflow
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            How <span className="gradient-text">Kaushal AI</span> Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            5 simple steps from uploading your profile to becoming confident and interview-ready.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            {
              step: '01',
              title: 'Upload Resume',
              desc: 'Provide your resume PDF or self-description to extract verified skills and projects.',
            },
            {
              step: '02',
              title: 'Add Job Description',
              desc: 'Paste the target job description or requirements for the role you desire.',
            },
            {
              step: '03',
              title: 'AI Profile Analysis',
              desc: 'Our Gemini AI compares your demonstrated capabilities against role demands and calculates match score.',
            },
            {
              step: '04',
              title: 'Personalized Practice',
              desc: 'Practice technical questions, project defense, and STAR behavioral questions.',
            },
            {
              step: '05',
              title: 'Iterate & Get Hired',
              desc: 'Receive realistic feedback, close skill gaps, and download an ATS-optimized resume.',
            },
          ].map((s, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '2rem 1.5rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--primary)',
                  opacity: 0.6,
                  marginBottom: '1rem',
                }}
              >
                {s.step}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Features Grid ── */}
      <section
        id="features"
        style={{
          padding: '6rem 2rem',
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
              Comprehensive Platform
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Everything You Need to <span className="gradient-text">Ace Any Tech Interview</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto' }}>
              Built specifically for students, software engineers, and job seekers aiming for top tier roles.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {[
              {
                icon: Sparkles,
                title: 'AI Interview Strategy',
                desc: 'Deep matching between your resume and job description with tailored questions and model answers.',
              },
              {
                icon: Bot,
                title: 'Kaushal AI Coach',
                desc: 'Context-aware 24/7 conversational mentor who knows your skill gaps, target role, and past reports.',
              },
              {
                icon: Mic,
                title: 'Mock Interviews',
                desc: 'Simulate technical and behavioral interviews with real-time answer scoring and actionable critique.',
              },
              {
                icon: FileSearch,
                title: 'Resume Diagnostics',
                desc: 'ATS readiness scoring, missing keyword detection, and section-by-section improvements.',
              },
              {
                icon: Briefcase,
                title: 'Job Description Analyzer',
                desc: 'Extract core technical competencies, required vs preferred skills, and preparation checklists.',
              },
              {
                icon: Compass,
                title: 'Interactive Roadmap',
                desc: 'Structured 14-day study plan with checkable daily milestones and topic-specific drilldowns.',
              },
              {
                icon: Shield,
                title: 'Project Defense Mode',
                desc: 'Rigorously practice explaining project architecture, tech trade-offs, and scaling to 10k users.',
              },
              {
                icon: TrendingUp,
                title: 'Progress Analytics',
                desc: 'Visual charts tracking interview scores, technical accuracy, practice streaks, and skill mastery.',
              },
              {
                icon: Award,
                title: 'ATS Resume PDF Generator',
                desc: 'Generate clean, ATS-compliant resumes formatted perfectly for recruiter screening algorithms.',
              },
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(99, 102, 241, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                    }}
                  >
                    <Icon size={24} color="var(--primary)" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Final Call to Action ── */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', position: 'relative' }}>
        <div
          className="glass-card"
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '4.5rem 2rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid var(--border-hover)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1.25rem' }}>
            Ready to become <span className="gradient-text">Interview-Ready?</span>
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
            }}
          >
            Start your free personalized AI preparation journey now. Upload your resume, target your dream role,
            and practice with realistic AI coaching.
          </p>
          <button onClick={handleStart} className="btn btn-primary btn-lg" style={{ fontSize: '1.1rem' }}>
            <Sparkles size={20} />
            <span>Start Preparing Free</span>
          </button>
        </div>
      </section>

      {/* ── 7. Footer ── */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '3rem 2.5rem',
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Sparkles size={18} color="var(--primary)" />
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Kaushal AI</span>
          <span>— Your Personal AI Interview Coach</span>
        </div>

        <div>
          <span>Crafted for college final-year projects, portfolios, & placements. 100% Free & Open.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
