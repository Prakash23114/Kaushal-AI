import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleVerifyOtp, handleResendOtp } = useAuth();

  // Retrieve email from state, URL query parameter, or session storage
  const [email, setEmail] = useState(() => {
    return (
      location.state?.email ||
      new URLSearchParams(location.search).get('email') ||
      sessionStorage.getItem('kaushal_verify_email') ||
      ''
    );
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeIdx, setActiveIdx] = useState(0);
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const inputRefs = useRef([]);

  // Save email to session storage for refresh resilience
  useEffect(() => {
    if (email) {
      sessionStorage.setItem('kaushal_verify_email', email);
    }
  }, [email]);

  // Focus the first input box on initial load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // 45-second countdown timer for Resend
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    setCanResend(false);
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Handle single digit input
  const handleChange = (e, index) => {
    const val = e.target.value;
    // Allow only numeric digits
    const cleaned = val.replace(/\D/g, '');

    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    // If multiple digits were typed or pasted into this box
    if (cleaned.length > 1) {
      handlePastedCode(cleaned);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleaned[0];
    setOtp(newOtp);
    setErrorMsg('');

    // Advance focus to next input box
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveIdx(index + 1);
    }

    // Auto-verify if all 6 digits are filled
    const fullCode = newOtp.join('');
    if (fullCode.length === 6 && !newOtp.includes('')) {
      submitVerification(fullCode);
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setActiveIdx(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIdx(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveIdx(index + 1);
    }
  };

  // Handle clipboard paste (e.g. user copies "125678")
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    handlePastedCode(pasted);
  };

  const handlePastedCode = (code) => {
    const digits = code.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 0) return;

    const newOtp = ['', '', '', '', '', ''];
    digits.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });

    setOtp(newOtp);
    setErrorMsg('');

    const targetIdx = Math.min(digits.length, 5);
    inputRefs.current[targetIdx]?.focus();
    setActiveIdx(targetIdx);

    if (digits.length === 6) {
      submitVerification(newOtp.join(''));
    }
  };

  // Submit OTP for verification
  const submitVerification = async (codeToVerify) => {
    const code = codeToVerify || otp.join('');
    if (code.length !== 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.');
      return;
    }

    if (!email) {
      setErrorMsg('Email address is missing. Please return to sign in.');
      return;
    }

    setErrorMsg('');
    setVerifying(true);

    try {
      await handleVerifyOtp({ email, otp: code });
      setSuccessMsg('Email verified successfully! Redirecting...');
      sessionStorage.removeItem('kaushal_verify_email');
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed. Please check the code.');
    } finally {
      setVerifying(false);
    }
  };

  // Resend OTP handler
  const handleResend = async () => {
    if (!canResend || resending || !email) return;

    setResending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await handleResendOtp({ email });
      setSuccessMsg('A fresh 6-digit code has been sent to your email.');
      setCountdown(45);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setActiveIdx(0);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to resend code. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fdfbf7 0%, #f6ede3 50%, #f5e6d6 100%)',
        padding: '2rem 1.25rem',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle warm glow background accent */}
      <div
        style={{
          position: 'absolute',
          width: '560px',
          height: '560px',
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.12) 0%, rgba(249, 115, 22, 0.04) 50%, transparent 70%)',
          filter: 'blur(70px)',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Card - Matching User's Screenshot */}
      <div
        style={{
          maxWidth: '430px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '2.5rem 2rem 2.25rem 2rem',
          boxShadow: '0 20px 45px rgba(220, 160, 120, 0.12), 0 4px 16px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Logo: Graduation Cap + Kaushal AI */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.55rem',
            marginBottom: '1.25rem',
          }}
        >
          {/* Custom Stylized Graduation Cap matching the screenshot */}
          <svg
            width="34"
            height="34"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
          >
            {/* Cap Diamond */}
            <path
              d="M18 6L32 13.5L18 21L4 13.5L18 6Z"
              fill="#18181b"
            />
            {/* Cap Skull Under */}
            <path
              d="M8.5 16.5V23.5C8.5 27 12.5 30 18 30C23.5 30 27.5 27 27.5 23.5V16.5L18 21.5L8.5 16.5Z"
              fill="#27272a"
            />
            {/* Tassel */}
            <path
              d="M30 15V24C30 24.8 29.5 25.5 28.5 25.5"
              stroke="#ea580c"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="28.5" cy="26" r="2" fill="#ea580c" />
          </svg>

          <span
            style={{
              fontSize: '1.45rem',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.4px',
            }}
          >
            Kaushal <span style={{ color: '#ea580c' }}>AI</span>
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: '1.85rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.5px',
          }}
        >
          Verify Your Email
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '0.925rem',
            color: '#64748b',
            lineHeight: '1.5',
            margin: '0 auto 1.85rem auto',
            maxWidth: '320px',
          }}
        >
          We've sent a 6-digit verification code to
          <br />
          <strong
            style={{
              color: '#334155',
              fontWeight: '600',
              wordBreak: 'break-all',
              fontSize: '0.95rem',
            }}
          >
            {email || 'your email'}
          </strong>
        </p>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '12px',
              color: '#b91c1c',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: '#f0fdf4',
              border: '1px solid #dcfce7',
              borderRadius: '12px',
              color: '#15803d',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              textAlign: 'left',
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 6-Digit OTP Inputs */}
        <div
          onPaste={handlePaste}
          style={{
            display: 'flex',
            gap: '0.55rem',
            justifyContent: 'center',
            marginBottom: '1.75rem',
          }}
        >
          {otp.map((digit, idx) => {
            const isFocused = activeIdx === idx;
            return (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onFocus={() => setActiveIdx(idx)}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                disabled={verifying}
                style={{
                  width: '48px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  border: isFocused ? '2px solid #ea580c' : '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  outline: 'none',
                  boxShadow: isFocused ? '0 0 0 3px rgba(234, 88, 12, 0.12)' : 'none',
                  transition: 'all 0.18s ease',
                  cursor: verifying ? 'not-allowed' : 'text',
                  caretColor: '#ea580c',
                }}
              />
            );
          })}
        </div>

        {/* Verify Button (Optional explicit action, auto-triggers on 6th digit) */}
        <button
          onClick={() => submitVerification()}
          disabled={verifying || otp.join('').length !== 6}
          style={{
            width: '100%',
            padding: '0.875rem',
            borderRadius: '12px',
            background:
              otp.join('').length === 6 && !verifying
                ? 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)'
                : '#f1f5f9',
            color: otp.join('').length === 6 && !verifying ? '#ffffff' : '#94a3b8',
            fontSize: '0.975rem',
            fontWeight: '600',
            border: 'none',
            cursor: otp.join('').length === 6 && !verifying ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            boxShadow:
              otp.join('').length === 6 && !verifying
                ? '0 4px 14px rgba(234, 88, 12, 0.25)'
                : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {verifying ? (
            <>
              <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify & Continue</span>
          )}
        </button>

        {/* Resend Countdown Link - Exactly matching screenshot */}
        <div
          style={{
            fontSize: '0.925rem',
            color: '#64748b',
            marginBottom: '1.5rem',
          }}
        >
          Didn't receive the code?{' '}
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resending}
              style={{
                background: 'none',
                border: 'none',
                color: '#ea580c',
                fontWeight: '600',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.925rem',
              }}
            >
              {resending ? (
                <>
                  <RefreshCw size={13} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Resending...</span>
                </>
              ) : (
                'Resend code'
              )}
            </button>
          ) : (
            <span style={{ color: '#ea580c', fontWeight: '600' }}>
              Resend in {countdown}s
            </span>
          )}
        </div>

        {/* Back to Sign In Link */}
        <div>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#ea580c',
              fontSize: '0.925rem',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <ArrowLeft size={16} />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
