import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  noPadding?: boolean;
}

export default function Card({
  children,
  title,
  subtitle,
  className = '',
  noPadding = false,
}: CardProps) {
  return (
    <div className={`card shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className="card-header bg-light">
          {title && <h3 className="card-title mb-0">{title}</h3>}
          {subtitle && <p className="text-muted mb-0 mt-1"><small>{subtitle}</small></p>}
        </div>
      )}
      <div className={noPadding ? 'card-body p-0' : 'card-body'}>
        {children}
      </div>
    </div>
  );
}
