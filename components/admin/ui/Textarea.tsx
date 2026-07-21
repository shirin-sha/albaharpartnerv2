
interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  error?: string;
  className?: string;
}

export default function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  disabled = false,
  helperText,
  error,
  className = '',
}: TextareaProps) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`form-control ${error ? 'is-invalid' : ''}`}
      />
      {helperText && !error && (
        <small className="form-text text-muted d-block mt-1">{helperText}</small>
      )}
      {error && (
        <div className="invalid-feedback d-block">{error}</div>
      )}
    </div>
  );
}
