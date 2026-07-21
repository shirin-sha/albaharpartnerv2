'use client';

interface LanguageSwitchProps {
  language: 'ltr' | 'rtl';
  onChange: (language: 'ltr' | 'rtl') => void;
  className?: string;
}

export default function LanguageSwitch({ language, onChange, className = '' }: LanguageSwitchProps) {
  return (
    <div
      className={`btn-group ${className}`}
      role="group"
      style={{
        borderRadius: '6px',
        overflow: 'hidden',
        background: 'var(--bg-1)',
        boxShadow: '0 0 0 1px var(--outline)',
      }}
    >
      <button
        type="button"
        className="btn border-0 flex-grow-1 py-1 px-3 d-flex align-items-center justify-content-center gap-1"
        style={{
          background: language === 'ltr' ? 'var(--primary)' : 'transparent',
          color: language === 'ltr' ? '#ffffff' : 'var(--on-suface-variant-1)',
          fontWeight: 500,
          fontSize: '0.8rem',
        }}
        onClick={() => onChange('ltr')}
      >
        <span>English</span>
        <span className="text-muted d-none d-md-inline"></span>
      </button>
      <button
        type="button"
        className="btn border-0 flex-grow-1 py-1 px-3 d-flex align-items-center justify-content-center gap-1"
        style={{
          background: language === 'rtl' ? 'var(--primary)' : 'transparent',
          color: language === 'rtl' ? '#ffffff' : 'var(--on-suface-variant-1)',
          fontWeight: 500,
          fontSize: '0.8rem',
        }}
        onClick={() => onChange('rtl')}
      >
        <span>Arabic</span>
        <span className="text-muted d-none d-md-inline"></span>
      </button>
    </div>
  );
}
