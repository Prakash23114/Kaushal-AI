import React from 'react';
import KaushalLogo from './KaushalLogo';
import '../auth.form.scss';

export const AuthLayout = ({
  children,
  variant = 'login',
  cardWidth = 'default',
  title = '',
  subtitle = '',
}) => {
  return (
    <div className="kaushal-auth-shell">
      {/* Decorative Warm Ambient Glow Spots */}
      <div
        style={{
          position: 'absolute',
          width: '540px',
          height: '540px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234, 88, 12, 0.08) 0%, rgba(249, 115, 22, 0.02) 60%, transparent 80%)',
          filter: 'blur(60px)',
          top: '12%',
          left: '18%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '480px',
          height: '480px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          bottom: '10%',
          right: '15%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div className="kaushal-auth-container">
        {/* ===================================================================
            VARIANT-SPECIFIC SURROUNDING COMPANION DECORATIONS
           =================================================================== */}

        {/* 1. LOGIN DECORATIONS: Yellow Sticky + Stacked Books */}
        {variant === 'login' && (
          <>
            <div className="auth-sticky-note sticky-left">
              <div className="sticky-tape" />
              <div style={{ fontWeight: 600 }}>Practice</div>
              <div style={{ fontWeight: 600 }}>Learn</div>
              <div style={{ fontWeight: 600 }}>Improve</div>
              <div style={{ fontWeight: 700, marginTop: '0.15rem' }}>
                Get Hired ! <span style={{ fontSize: '1.25rem' }}>😊</span>
              </div>
            </div>

            <div className="auth-book-stack">
              <div className="book-spine" style={{ background: '#f8efe6', color: '#451a03' }}>
                Better Skills
              </div>
              <div className="book-spine book-2" style={{ background: '#f5e4d2', color: '#451a03' }}>
                Better Opportunities
              </div>
              <div className="book-spine" style={{ transform: 'rotate(-1deg)', background: '#ebd7c2', color: '#451a03' }}>
                Brighter Future
              </div>
            </div>
          </>
        )}

        {/* 2. REGISTER DECORATIONS: Student Companion + Doodle Arrow */}
        {variant === 'register' && (
          <>
            <div
              className="auth-doodle-text"
              style={{
                left: '6%',
                top: '18%',
                maxWidth: '160px',
                textAlign: 'center',
                flexDirection: 'column',
                gap: '0.2rem',
              }}
            >
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#334155' }}>
                Your Career Companion
              </div>
              {/* Hand-drawn arrow SVG */}
              <svg width="38" height="42" viewBox="0 0 38 42" fill="none">
                <path
                  d="M12 4C18 12 28 20 22 34M22 34L14 30M22 34L28 26"
                  stroke="#334155"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ fontSize: '1.2rem', color: '#f59e0b' }}>✨ ✦</span>
            </div>

            <div className="auth-companion-art companion-left">
              <img
                src="/assets/auth_student_boy.jpg"
                alt="Your Career Companion"
                style={{
                  maxHeight: '440px',
                  borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(180, 100, 40, 0.16)',
                  border: '4px solid #ffffff',
                }}
              />
            </div>
          </>
        )}

        {/* 3. VERIFY EMAIL DECORATIONS: Sticky Note + Paper Airplane Doodle */}
        {variant === 'verify-email' && (
          <>
            <div
              className="auth-sticky-note"
              style={{
                left: '6%',
                top: '24%',
                transform: 'rotate(-5deg)',
                maxWidth: '180px',
                textAlign: 'center',
              }}
            >
              <div className="sticky-tape" />
              <div style={{ fontSize: '1.45rem', fontWeight: 700, lineHeight: 1.25 }}>
                One Step Closer to Your Goals 😊
              </div>
            </div>

            {/* Paper Airplane Doodle */}
            <div
              className="auth-doodle-text"
              style={{
                right: '8%',
                top: '18%',
                transform: 'rotate(15deg)',
              }}
            >
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
                  stroke="#c2572b"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </>
        )}

        {/* 4. FORGOT PASSWORD DECORATIONS: Sticky Note + Desk Ambiance */}
        {variant === 'forgot-password' && (
          <>
            <div
              className="auth-sticky-note"
              style={{
                left: '6%',
                top: '28%',
                transform: 'rotate(-4deg)',
                maxWidth: '190px',
                textAlign: 'center',
              }}
            >
              <div className="sticky-tape" />
              <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>
                Happens to the best of us! ☺
              </div>
            </div>
          </>
        )}

        {/* 5. RESET PASSWORD DECORATIONS: Stronger Account Stronger You */}
        {variant === 'reset-password' && (
          <>
            <div
              className="auth-doodle-text"
              style={{
                left: '7%',
                top: '32%',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.15rem',
              }}
            >
              <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#1e293b' }}>
                Stronger Account
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 700, color: '#c2572b' }}>
                Stronger You ! 💪
              </div>
            </div>
          </>
        )}

        {/* 6. ALL SET DECORATIONS: Back to Learning & Growing + Celebrate Student */}
        {variant === 'all-set' && (
          <>
            <div
              className="auth-doodle-text"
              style={{
                right: '8%',
                top: '18%',
                flexDirection: 'column',
                textAlign: 'center',
                gap: '0.25rem',
              }}
            >
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e293b' }}>
                Back to
                <br />
                Learning & Growing
              </div>
              {/* Doodle Arrow */}
              <svg width="36" height="38" viewBox="0 0 38 42" fill="none">
                <path
                  d="M10 6C18 14 26 22 22 34M22 34L14 30M22 34L28 26"
                  stroke="#c2572b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ fontSize: '1.3rem', color: '#f59e0b' }}>⭐ ✨</span>
            </div>

            <div className="auth-companion-art companion-right">
              <img
                src="/assets/auth_student_celebrate.jpg"
                alt="Celebrate Success"
                style={{
                  maxHeight: '440px',
                  borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(22, 163, 74, 0.18)',
                  border: '4px solid #ffffff',
                }}
              />
            </div>
          </>
        )}

        {/* ===================================================================
            MAIN AUTH WHITE CARD
           =================================================================== */}
        <div className={`kaushal-auth-card ${cardWidth === 'wide' ? 'wide-card' : ''}`}>
          {/* Logo Header */}
          <div className="auth-brand-header">
            <KaushalLogo />
            {title && <h1 className="auth-title">{title}</h1>}
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>

          {/* Page Content / Form */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
