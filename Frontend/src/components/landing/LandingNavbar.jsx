import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { GraduationCap, ArrowRight, Menu, X } from 'lucide-react';
import { useAuth } from '../../Features/auth/hooks/useAuth';

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (id === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.querySelector(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleStart = () => {
    if (user) {
      navigate('/app/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 249, 241, 0.96)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${isScrolled ? 'var(--lp-border)' : 'transparent'}`,
        transition: 'all 0.25s ease',
        boxShadow: isScrolled ? '0 4px 20px rgba(23, 32, 51, 0.04)' : 'none',
      }}
    >
      <div
        className="lp-container"
        style={{
          height: '74px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--lp-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(201, 79, 45, 0.28)',
            }}
          >
            <GraduationCap size={24} color="#ffffff" strokeWidth={2.2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-lp-heading)',
                fontWeight: 800,
                fontSize: '1.35rem',
                color: 'var(--lp-text-dark)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Kaushal <span style={{ color: 'var(--lp-primary)' }}>AI</span>
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                color: 'var(--lp-text-muted)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Career & Interview Companion
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          className="lp-desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.25rem',
            fontSize: '0.94rem',
            fontWeight: 600,
          }}
        >
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            style={{
              color: 'var(--lp-text-dark)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              position: 'relative',
              padding: '0.25rem 0',
            }}
            className="lp-nav-link"
          >
            Home
          </a>
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, '#features')}
            style={{
              color: 'var(--lp-text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            className="lp-nav-link"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => handleNavClick(e, '#how-it-works')}
            style={{
              color: 'var(--lp-text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            className="lp-nav-link"
          >
            How It Works
          </a>
          <a
            href="#why-kaushal"
            onClick={(e) => handleNavClick(e, '#why-kaushal')}
            style={{
              color: 'var(--lp-text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            className="lp-nav-link"
          >
            Why Kaushal
          </a>
          <a
            href="#faqs"
            onClick={(e) => handleNavClick(e, '#faqs')}
            style={{
              color: 'var(--lp-text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            className="lp-nav-link"
          >
            FAQs
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div
          className="lp-nav-actions"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {user ? (
            <button onClick={() => navigate('/app/dashboard')} className="lp-btn-primary">
              <span>Go to Dashboard</span>
              <ArrowRight size={17} />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--lp-text-dark)',
                  fontWeight: 600,
                  fontSize: '0.94rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--lp-peach-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Login
              </button>
              <button onClick={handleStart} className="lp-btn-primary" style={{ padding: '0.65rem 1.35rem' }}>
                <span>Get Started</span>
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lp-mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'none',
            background: 'var(--lp-white)',
            border: '1px solid var(--lp-border)',
            borderRadius: '10px',
            padding: '0.5rem',
            color: 'var(--lp-text-dark)',
            cursor: 'pointer',
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--lp-white)',
            borderBottom: '1px solid var(--lp-border)',
            padding: '1.25rem 1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--lp-shadow-md)',
          }}
        >
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            style={{
              padding: '0.6rem 0',
              fontWeight: 600,
              color: 'var(--lp-text-dark)',
              borderBottom: '1px solid var(--lp-border-subtle)',
            }}
          >
            Home
          </a>
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, '#features')}
            style={{
              padding: '0.6rem 0',
              fontWeight: 600,
              color: 'var(--lp-text-dark)',
              borderBottom: '1px solid var(--lp-border-subtle)',
            }}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => handleNavClick(e, '#how-it-works')}
            style={{
              padding: '0.6rem 0',
              fontWeight: 600,
              color: 'var(--lp-text-dark)',
              borderBottom: '1px solid var(--lp-border-subtle)',
            }}
          >
            How It Works
          </a>
          <a
            href="#why-kaushal"
            onClick={(e) => handleNavClick(e, '#why-kaushal')}
            style={{
              padding: '0.6rem 0',
              fontWeight: 600,
              color: 'var(--lp-text-dark)',
              borderBottom: '1px solid var(--lp-border-subtle)',
            }}
          >
            Why Kaushal
          </a>
          <a
            href="#faqs"
            onClick={(e) => handleNavClick(e, '#faqs')}
            style={{
              padding: '0.6rem 0',
              fontWeight: 600,
              color: 'var(--lp-text-dark)',
              borderBottom: '1px solid var(--lp-border-subtle)',
            }}
          >
            FAQs
          </a>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app/dashboard');
                }}
                className="lp-btn-primary"
                style={{ width: '100%' }}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="lp-btn-secondary"
                  style={{ width: '100%' }}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="lp-btn-primary"
                  style={{ width: '100%' }}
                >
                  Get Started Free →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .lp-desktop-nav, .lp-nav-actions {
            display: none !important;
          }
          .lp-mobile-menu-btn {
            display: inline-flex !important;
          }
        }
        .lp-nav-link:hover {
          color: var(--lp-primary) !important;
        }
      `}</style>
    </header>
  );
};

export default LandingNavbar;
