import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import GoogleAuthButton from '../components/GoogleAuthButton';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { handleForgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    try {
      await handleForgotPassword({ email: email.trim() });
      setSuccessMsg('Reset code sent! Redirecting to password reset...');
      setTimeout(() => {
        navigate('/reset-password', { state: { email: email.trim() } });
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send reset code. Please check your email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      variant="forgot-password"
      title="Forgot Password?"
      subtitle="No worries! Enter your email address and we'll send you a reset link."
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

      {/* Forgot Password Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field-group">
          <div className="auth-input-wrapper">
            <Mail size={18} className="auth-input-icon" />
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prakashmandal23114@gmail.com"
              required
              className="auth-input"
              autoComplete="email"
              style={{ paddingLeft: '2.65rem', paddingRight: '1rem' }}
            />
          </div>
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
              <span>Sending Code...</span>
            </>
          ) : (
            <>
              <span>Send Reset Link</span>
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      {/* Continue with Google */}
      <GoogleAuthButton text="Continue with Google" />

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

export default ForgotPassword;
