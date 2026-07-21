import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export default function Alert({ type, message, onClose, className = '' }: AlertProps) {
  const alertClass = {
    success: 'alert-success',
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }[type];

  return (
    <div 
      className={`alert ${alertClass} alert-dismissible fade show ${className}`} 
      role="alert"
      style={{
        fontSize: '1.1rem',
        padding: '1rem 1.25rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <strong style={{ fontSize: '1.3rem' }}>{icon}</strong> 
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
          style={{ marginLeft: 'auto' }}
        ></button>
      )}
    </div>
  );
}
