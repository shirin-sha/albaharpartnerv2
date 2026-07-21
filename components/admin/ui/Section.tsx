import React, { useState } from 'react';

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
}

export default function Section({
  title,
  description,
  children,
  actions,
  className = '',
  defaultCollapsed = false,
}: SectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`mb-4 ${className}`}>
      <div 
        className="d-flex justify-content-between align-items-start mb-3 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex align-items-center gap-2 flex-grow-1">
          <button
            type="button"
            className="btn btn-link p-0 border-0 text-muted"
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            style={{ minWidth: '20px' }}
          >
            <i 
              className="icon-chevron-down" 
              style={{ 
                transition: 'transform 0.2s',
                transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                display: 'inline-block'
              }}
            />
          </button>
          <div>
            <h4 className="mb-1">{title}</h4>
            {description && !isCollapsed && (
              <p className="text-muted mb-0"><small>{description}</small></p>
            )}
          </div>
        </div>
        {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
      </div>
      {!isCollapsed && <div>{children}</div>}
    </div>
  );
}
