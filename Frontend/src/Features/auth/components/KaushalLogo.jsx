import React from 'react';
import { useNavigate } from 'react-router';

export const KaushalLogo = ({ showText = true, size = 'default' }) => {
  const navigate = useNavigate();

  const iconDimensions = size === 'small' ? { w: 28, h: 28 } : { w: 34, h: 34 };

  return (
    <div
      onClick={() => navigate('/')}
      className="auth-logo-row"
      title="Kaushal AI"
    >
      {/* Stylized Graduation Cap matching user's design */}
      <svg
        width={iconDimensions.w}
        height={iconDimensions.h}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', flexShrink: 0 }}
      >
        {/* Cap Diamond / Mortarboard */}
        <path
          d="M18 6L32 13.5L18 21L4 13.5L18 6Z"
          fill="#18181b"
        />
        {/* Skull Cap Underside */}
        <path
          d="M8.5 16.5V23.5C8.5 27 12.5 30 18 30C23.5 30 27.5 27 27.5 23.5V16.5L18 21.5L8.5 16.5Z"
          fill="#27272a"
        />
        {/* Orange Tassel String */}
        <path
          d="M30 15V24C30 24.8 29.5 25.5 28.5 25.5"
          stroke="#ea580c"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Orange Tassel Bead */}
        <circle cx="28.5" cy="26" r="2.2" fill="#ea580c" />
      </svg>

      {showText && (
        <span className="brand-name">
          Kaushal <span className="brand-accent">AI</span>
        </span>
      )}
    </div>
  );
};

export default KaushalLogo;
