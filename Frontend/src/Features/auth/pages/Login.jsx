import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import GoogleAuthButton from '../components/GoogleAuthButton';

export const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const err = params.get('error');
    if (err) {
      setErrorMsg(decodeURIComponent(err));
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await handleLogin({ email, password });
      navigate('/app/dashboard');
    } catch (err) {
      if (err.requiresVerification || err.response?.data?.requiresVerification) {
        const verifyEmail = err.email || err.response?.data?.email || email;
        navigate('/verify-email', { state: { email: verifyEmail } });
        return;
      }
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      variant="login"
      title={
        <>
          Welcome Back <span style={{ fontSize: '1.65rem' }}>👋</span>
        </>
      }
      subtitle="Sign in to continue your personalized interview preparation."
    >
      {/* Error Alert */}
      {errorMsg && (
        <div className="auth-alert error">
          <AlertCircle size={17} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Email Address */}
        <div className="auth-field-group">
          <label htmlFor="login-email">Email Address</label>
          <div className="auth-input-wrapper">
            <Mail size={18} className="auth-input-icon" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prakashmandal23114@gmail.com"
              required
              className="auth-input"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="auth-field-group">
          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="auth-input"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Right-aligned Forgot Password Link */}
          <div className="auth-forgot-link-wrapper">
            <Link to="/forgot-password" className="auth-forgot-link">
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={submitting || loading}
          className="auth-btn-primary"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      {/* Continue with Google */}
      <GoogleAuthButton text="Continue with Google" />

      {/* Footer Text */}
      <div className="auth-footer-prompt">
        Don't have an account?{' '}
        <Link to="/register">Create one free</Link>
      </div>
    </AuthLayout>
  );
};

export default Login;