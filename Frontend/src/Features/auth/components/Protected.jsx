import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getProfileMe } from '../../interview/services/interview.api';

export const Protected = ({ children, skipOnboardingCheck = false }) => {
  const { loading, user } = useAuth();
  const location = useLocation();
  const [profileLoading, setProfileLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkUserProfile = async () => {
      if (!user) {
        if (isMounted) setProfileLoading(false);
        return;
      }

      try {
        const data = await getProfileMe();
        if (isMounted) {
          setHasProfile(!!data?.hasProfile);
        }
      } catch (err) {
        console.error('Error checking profile:', err);
        if (isMounted) {
          setHasProfile(false);
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    if (user) {
      checkUserProfile();
    } else if (!loading) {
      setProfileLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user, loading, location.pathname]);

  if (loading || (user && profileLoading)) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-app)',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--primary)',
            animation: 'pulseGlow 1.5s infinite ease-in-out',
          }}
        >
          <Sparkles size={24} color="var(--primary)" />
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Authenticating Kaushal AI profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Mandatory Resume Onboarding check
  if (!skipOnboardingCheck && hasProfile === false) {
    return <Navigate to="/app/onboarding" replace />;
  }

  // If user already has profile and visits /app/onboarding, send to dashboard
  if (skipOnboardingCheck && hasProfile === true && location.pathname === '/app/onboarding') {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};

export default Protected;