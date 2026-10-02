import {
  GraduationCap,
  LayoutDashboard,
  Mic,
  FileSearch,
  Bot,
  Compass,
  BarChart3,
  BookOpen,
  Search,
  Bell,
  TrendingUp,
  Clock
} from 'lucide-react';

export const HeroProductPreview = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
      }}
    >
      {/* ── Top-right Floating Sticky Note ── */}
      <div
        className="handwritten-note note-yellow"
        style={{
          position: 'absolute',
          top: '-24px',
          right: '8px',
          zIndex: 12,
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
          transform: 'rotate(4deg)',
          fontSize: '1.05rem',
          padding: '0.5rem 0.9rem',
          lineHeight: 1.2,
        }}
      >
        <div>Better Skills</div>
        <div>Better Opportunities! 😊</div>
      </div>

      {/* ── Composite Container: Student Photo + Dashboard Mockup ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '0.85fr 1.35fr',
          gap: '12px',
          alignItems: 'flex-end',
          position: 'relative',
        }}
        className="hero-composite-grid"
      >
        {/* Left: Warm Student Desk Photo */}
        <div
          style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid var(--lp-border)',
            boxShadow: 'var(--lp-shadow-md)',
            height: '310px',
          }}
          className="hero-student-photo-card"
        >
          <img
            src="/assets/hero-student.jpg"
            alt="Student practicing technical interviews with Kaushal AI"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%',
              display: 'block',
            }}
          />
          {/* Subtle gradient vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(255, 249, 241, 0) 60%, rgba(255, 249, 241, 0.8) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Sticky Note on Student Photo */}
          <div
            className="handwritten-note note-peach"
            style={{
              position: 'absolute',
              top: '12px',
              left: '10px',
              zIndex: 10,
              fontSize: '0.98rem',
              padding: '0.45rem 0.75rem',
              transform: 'rotate(-4deg)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            Practice. Learn. <br />
            Improve. Get Hired! ✨
          </div>
        </div>

        {/* Right: Laptop Screen Mockup */}
        <div style={{ position: 'relative' }}>
          {/* Laptop Frame */}
          <div
            style={{
              background: '#1F232B',
              borderRadius: '14px 14px 4px 4px',
              padding: '8px 8px 10px 8px',
              border: '1.5px solid #3E4352',
              boxShadow: '0 20px 40px -10px rgba(23, 32, 51, 0.22)',
              position: 'relative',
            }}
          >
            {/* Webcam / Mic Bezel */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                paddingBottom: '6px',
              }}
            >
              <div
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#0F1218',
                  border: '1px solid #484E60',
                }}
              />
              <div
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                }}
              />
            </div>

            {/* Laptop Screen Content */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid #EBE3DA',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'var(--font-lp-body)',
                userSelect: 'none',
              }}
            >
              {/* Top Bar */}
              <div
                style={{
                  height: '34px',
                  backgroundColor: '#FFFFFF',
                  borderBottom: '1px solid #EFE6DC',
                  padding: '0 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '5px',
                      backgroundColor: 'var(--lp-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <GraduationCap size={11} color="#ffffff" />
                  </div>
                  <span style={{ fontWeight: 800, color: 'var(--lp-text-dark)', fontSize: '11px' }}>
                    Kaushal <span style={{ color: 'var(--lp-primary)' }}>AI</span>
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#F7EFE6',
                    padding: '3px 6px',
                    borderRadius: '5px',
                    color: '#8C7B6C',
                    fontSize: '9px',
                    width: '140px',
                  }}
                >
                  <Search size={10} />
                  <span>Search DSA, roadmaps...</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bell size={11} color="#8C7B6C" />
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--lp-primary)',
                      color: '#fff',
                      fontSize: '8px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    P
                  </div>
                </div>
              </div>

              {/* Body: Mini Sidebar + Main Content */}
              <div style={{ display: 'flex', height: '260px' }}>
                {/* Mini Sidebar */}
                <div
                  style={{
                    width: '92px',
                    backgroundColor: '#FFFFFF',
                    borderRight: '1px solid #EFE6DC',
                    padding: '8px 5px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  {[
                    { icon: LayoutDashboard, label: 'Dashboard', active: true },
                    { icon: Mic, label: 'Mock Interview' },
                    { icon: FileSearch, label: 'Resume Analyzer' },
                    { icon: Bot, label: 'AI Coach' },
                    { icon: Compass, label: 'Roadmap' },
                    { icon: BarChart3, label: 'Skills' },
                    { icon: BookOpen, label: 'Resources' },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3.5px 5px',
                          borderRadius: '4px',
                          fontSize: '8.5px',
                          fontWeight: item.active ? 700 : 500,
                          backgroundColor: item.active ? '#FFF0E8' : 'transparent',
                          color: item.active ? 'var(--lp-primary)' : '#5C677D',
                        }}
                      >
                        <Icon size={10} color={item.active ? 'var(--lp-primary)' : '#7C869A'} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Dashboard Main View */}
                <div
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7px',
                    backgroundColor: '#FCFAF7',
                  }}
                >
                  {/* Greeting */}
                  <div>
                    <h4 style={{ fontSize: '11px', fontWeight: 800, margin: 0, color: 'var(--lp-text-dark)' }}>
                      Welcome back, Prakash 👋
                    </h4>
                    <p style={{ fontSize: '8px', color: '#778298', margin: '1px 0 0' }}>
                      Keep practicing and move closer to your tech goals.
                    </p>
                  </div>

                  {/* 3 Quick Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                    {/* Mock Interview */}
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #F5DED2',
                        borderRadius: '6px',
                        padding: '6px 5px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            backgroundColor: '#FFF0E8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Mic size={9} color="var(--lp-primary)" />
                        </div>
                        <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--lp-text-dark)' }}>
                          Mock Interview
                        </span>
                      </div>
                      <span style={{ fontSize: '7.5px', fontWeight: 700, color: 'var(--lp-primary)' }}>
                        Practice now →
                      </span>
                    </div>

                    {/* Resume Analyzer */}
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #DAEBDD',
                        borderRadius: '6px',
                        padding: '6px 5px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            backgroundColor: '#EAF5EC',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FileSearch size={9} color="#347C42" />
                        </div>
                        <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--lp-text-dark)' }}>
                          Resume Analyzer
                        </span>
                      </div>
                      <span style={{ fontSize: '7.5px', fontWeight: 700, color: '#347C42' }}>
                        Get feedback →
                      </span>
                    </div>

                    {/* AI Coach */}
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #F9E8B8',
                        borderRadius: '6px',
                        padding: '6px 5px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px' }}>
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            backgroundColor: '#FEF8E3',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Bot size={9} color="#946C15" />
                        </div>
                        <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--lp-text-dark)' }}>
                          AI Coach
                        </span>
                      </div>
                      <span style={{ fontSize: '7.5px', fontWeight: 700, color: '#946C15' }}>
                        Chat with AI →
                      </span>
                    </div>
                  </div>

                  {/* Progress & Recent Activity */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '6px', flex: 1 }}>
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EFE6DC',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--lp-text-dark)' }}>
                          Your Progress
                        </span>
                        <TrendingUp size={10} color="var(--lp-primary)" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--lp-primary)', lineHeight: 1 }}>
                          70%
                        </span>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '18px' }}>
                          <div style={{ width: '4px', height: '8px', background: '#F8D9C8', borderRadius: '1px' }} />
                          <div style={{ width: '4px', height: '11px', background: '#F8D9C8', borderRadius: '1px' }} />
                          <div style={{ width: '4px', height: '14px', background: '#E28666', borderRadius: '1px' }} />
                          <div style={{ width: '4px', height: '18px', background: 'var(--lp-primary)', borderRadius: '1px' }} />
                        </div>
                      </div>
                      <span style={{ fontSize: '7px', color: '#778298' }}>Interview Readiness</span>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #EFE6DC',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--lp-text-dark)' }}>
                          Recent Activity
                        </span>
                        <Clock size={10} color="#8C7B6C" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px' }}>
                          <span style={{ fontWeight: 600, color: '#172033' }}>● Completed DSA Mock</span>
                          <span style={{ color: '#97A1B3' }}>2h ago</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px' }}>
                          <span style={{ fontWeight: 600, color: '#172033' }}>● Resume Feedback</span>
                          <span style={{ color: '#97A1B3' }}>1d ago</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px' }}>
                          <span style={{ fontWeight: 600, color: '#172033' }}>● Career Guidance Session</span>
                          <span style={{ color: '#97A1B3' }}>3d ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop Base */}
          <div
            style={{
              height: '11px',
              background: 'linear-gradient(180deg, #D4D8E0 0%, #A4A9B6 100%)',
              borderRadius: '0 0 14px 14px',
              boxShadow: '0 8px 18px rgba(0, 0, 0, 0.16)',
            }}
          />
        </div>
      </div>

      {/* ── Book Stack Positioned In Front ── */}
      <div
        className="book-stack"
        style={{
          position: 'absolute',
          bottom: '-14px',
          right: '20px',
          zIndex: 10,
          filter: 'drop-shadow(0 6px 12px rgba(23, 32, 51, 0.15))',
        }}
      >
        <div className="book-spine book-hired">GET HIRED</div>
        <div className="book-spine book-grow">GROW</div>
        <div className="book-spine book-learn">LEARN</div>
        <div className="book-spine book-practice">PRACTICE</div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-composite-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-student-photo-card {
            display: none !important;
          }
          .handwritten-note {
            display: none !important;
          }
          .book-stack {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroProductPreview;
