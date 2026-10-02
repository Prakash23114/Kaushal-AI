import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { ArrowRight, ArrowLeft, Loader2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleVerifyOtp, handleResendOtp } = useAuth();

  // Retrieve email from navigation state, URL query parameter, or session storage
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

  useEffect(() => {
    if (email) {
      sessionStorage.setItem('kaushal_verify_email', email);
    }
  }, [email]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // 45-second countdown timer for resend
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

  const handleChange = (e, index) => {
    const val = e.target.value;
    const cleaned = val.replace(/\D/g, '');

    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    if (cleaned.length > 1) {
      handlePastedCode(cleaned);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleaned[0];
    setOtp(newOtp);
    setErrorMsg('');

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveIdx(index + 1);
    }

    const fullCode = newOtp.join('');
    if (fullCode.length === 6 && !newOtp.includes('')) {
      submitVerification(fullCode);
    }
  };

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
      }, 1100);
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed. Please check the code.');
    } finally {
      setVerifying(false);
    }
  };

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
      setErrorMsg(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      variant="verify-email"
      title="Verify Your Email"
      subtitle={
        <>
          We've sent a 6-digit verification code to
          <br />
          <strong style={{ color: '#334155', fontWeight: 600, wordBreak: 'break-all' }}>
            {email || 'your email'}
          </strong>
        </>
      }
    >
      {/* Feedback Alerts */}
      {errorMsg && (
        <div className="auth-alert error">
          <AlertCircle size={17} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="auth-alert success">
          <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 6-Digit OTP Inputs */}
      <div className="auth-otp-grid" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
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
            className="auth-otp-cell"
            aria-label={`Digit ${idx + 1}`}
          />
        ))}
      </div>

      {/* Resend Link with 45s Countdown */}
      <div
        style={{
          fontSize: '0.9rem',
          color: '#64748b',
          textAlign: 'center',
          marginBottom: '1.35rem',
        }}
      >
        Didn't receive the code?{' '}
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--auth-terracotta)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.9rem',
            }}
          >
            {resending ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Resending...</span>
              </>
            ) : (
              'Resend'
            )}
          </button>
        ) : (
          <span style={{ color: 'var(--auth-terracotta)', fontWeight: 600 }}>
            Resend in {countdown}s
          </span>
        )}
      </div>

      {/* Primary Submit Button */}
      <button
        type="button"
        onClick={() => submitVerification()}
        disabled={verifying || otp.join('').length !== 6}
        className="auth-btn-primary"
      >
        {verifying ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <span>Verify</span>
            <ArrowRight size={17} />
          </>
        )}
      </button>

      {/* Back to Sign In Link */}
      <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
        <Link to="/login" className="auth-back-link">
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
