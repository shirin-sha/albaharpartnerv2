import React from 'react';

interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export default function FormGrid({ children, columns = 2, className = '' }: FormGridProps) {
  const colClass = {
    1: 'col-12',
    2: 'col-md-6',
    3: 'col-md-4',
    4: 'col-md-3',
  }[columns];

  return (
    <div className={`row g-3 ${className}`}>
      {React.Children.map(children, (child) => (
        <div className={colClass}>{child}</div>
      ))}
    </div>
  );
}
