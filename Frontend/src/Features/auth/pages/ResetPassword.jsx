import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, KeyRound, AlertCircle, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import PasswordCriteria from '../components/PasswordCriteria';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleResetPassword } = useAuth();

  const [email, setEmail] = useState(() => {
    return (
      location.state?.email ||
      new URLSearchParams(location.search).get('email') ||
      ''
    );
  });

  const [otp, setOtp] = useState(() => {
    return new URLSearchParams(location.search).get('code') || '';
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(() => {
    return (
      new URLSearchParams(location.search).get('success') === 'true' ||
      location.pathname === '/all-set'
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Email address is missing. Please return to forgot password.');
      return;
    }

    if (!otp.trim()) {
      setErrorMsg('Please enter the 6-digit reset code sent to your email.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setSubmitting(true);
    try {
      await handleResetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
      setIsSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password. Please check the code.');
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================================
     SCREEN 6: ALL SET! (SUCCESS VIEW)
     ========================================================================= */
  if (isSuccess) {
    return (
      <AuthLayout
        variant="all-set"
        cardWidth="default"
      >
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          {/* Big Green Circle Checkmark Badge with Celebration Radiance */}
          <div className="auth-success-badge-wrapper">
            {/* SVG Rays */}
            <svg
              className="success-rays"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="50" y1="12" x2="50" y2="4" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="77" y1="23" x2="83" y2="17" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="88" y1="50" x2="96" y2="50" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="77" y1="77" x2="83" y2="83" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="23" y1="23" x2="17" y2="17" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="12" y1="50" x2="4" y2="50" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="23" y1="77" x2="17" y2="83" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <div className="success-badge">
              <Check size={36} color="#ffffff" strokeWidth={3.5} />
            </div>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0.5rem 0 0.5rem 0',
              letterSpacing: '-0.5px',
            }}
          >
            All Set!
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '0.925rem',
              color: '#64748b',
              lineHeight: 1.5,
              margin: '0 auto 2rem auto',
              maxWidth: '310px',
            }}
          >
            Your password has been reset successfully. You can now sign in with your new password.
          </p>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="auth-btn-primary"
            style={{ width: '100%' }}
          >
            <span>Go to Sign In</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </AuthLayout>
    );
  }

  /* =========================================================================
     SCREEN 5: RESET YOUR PASSWORD (INPUT VIEW)
     ========================================================================= */
  return (
    <AuthLayout
      variant="reset-password"
      cardWidth="wide"
      title="Reset Your Password"
      subtitle="Enter a new password for your account."
    >
      {/* Error Alert */}
      {errorMsg && (
        <div className="auth-alert error">
          <AlertCircle size={17} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Reset Password Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Verification Code (If not auto-passed) */}
        {!new URLSearchParams(location.search).get('code') && (
          <div className="auth-field-group">
            <label htmlFor="reset-code">6-Digit Reset Code</label>
            <div className="auth-input-wrapper">
              <KeyRound size={18} className="auth-input-icon" />
              <input
                id="reset-code"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                required
                className="auth-input"
                style={{ paddingLeft: '2.65rem', paddingRight: '1rem', letterSpacing: otp ? '4px' : 'normal', fontWeight: 600 }}
              />
            </div>
          </div>
        )}

        {/* New Password */}
        <div className="auth-field-group">
          <label htmlFor="reset-new-password">New Password</label>
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />
            <input
              id="reset-new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="auth-input"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              title={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="auth-field-group">
          <label htmlFor="reset-confirm-password">Confirm New Password</label>
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />
            <input
              id="reset-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="auth-input"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Live Password Criteria Checklist */}
          <PasswordCriteria password={newPassword} />
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="auth-btn-primary"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Resetting Password...</span>
            </>
          ) : (
            <>
              <span>Reset Password</span>
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

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

export default ResetPassword;
