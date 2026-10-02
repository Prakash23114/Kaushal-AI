import React from 'react';
import { Check } from 'lucide-react';

export const PasswordCriteria = ({ password = '' }) => {
  const criteria = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
  ];

  return (
    <div className="auth-criteria-box">
      {criteria.map((item, idx) => (
        <div
          key={idx}
          className={`criteria-item ${item.valid ? 'met' : 'unmet'}`}
        >
          <div
            className="criteria-icon"
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: item.valid ? '#16a34a' : '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease',
            }}
          >
            <Check size={11} color="#ffffff" strokeWidth={3} />
          </div>
          <span style={{ fontSize: '0.825rem', lineHeight: '1.2' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordCriteria;
