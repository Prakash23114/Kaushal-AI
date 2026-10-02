import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import GoogleAuthButton from '../components/GoogleAuthButton';
import PasswordCriteria from '../components/PasswordCriteria';

export const Register = () => {
  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
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

    if (!username.trim() || !email.trim() || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password should be at least 8 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await handleRegister({ username: username.trim(), email: email.trim(), password });
      // Redirect to Verify Email screen with the registered email
      navigate('/verify-email', { state: { email: email.trim() } });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Username or email may already be in use.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      variant="register"
      cardWidth="wide"
      title="Create Your Account"
      subtitle="Join Kaushal AI and start your journey towards a better future."
    >
      {/* Error Alert */}
      {errorMsg && (
        <div className="auth-alert error">
          <AlertCircle size={17} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Full Name or Username */}
        <div className="auth-field-group">
          <label htmlFor="register-username">Full Name or Username</label>
          <div className="auth-input-wrapper">
            <User size={18} className="auth-input-icon" />
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Prakash Mandal or username"
              required
              className="auth-input"
              autoComplete="username"
            />
          </div>
        </div>


        {/* Email Address */}
        <div className="auth-field-group">
          <label htmlFor="register-email">Email Address</label>
          <div className="auth-input-wrapper">
            <Mail size={18} className="auth-input-icon" />
            <input
              id="register-email"
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
          <label htmlFor="register-password">Password</label>
          <div className="auth-input-wrapper">
            <Lock size={18} className="auth-input-icon" />
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="auth-input"
              autoComplete="new-password"
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

          {/* Live Password Criteria Checklist */}
          <PasswordCriteria password={password} />
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
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      {/* Continue with Google */}
      <GoogleAuthButton text="Continue with Google" />

      {/* Footer Text */}
      <div className="auth-footer-prompt">
        Already have an account?{' '}
        <Link to="/login">Sign in</Link>
      </div>
    </AuthLayout>
  );
};

export default Register;