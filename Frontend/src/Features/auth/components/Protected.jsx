import React from 'react';
import { Navigate } from 'react-router';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
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
          Authenticating Kaushal AI session...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;