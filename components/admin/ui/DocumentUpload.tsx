'use client';
import { useId, useRef, useState, useEffect } from 'react';
import {
  stageUpload,
  stageRemove,
  getPendingPreview,
} from '@/lib/pending-uploads';

interface DocumentUploadProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  folder?: string;
  /** Fixed storage name without random suffix, e.g. "bpc-profile.pdf" */
  fileName?: string;
  /** Label shown in preview (defaults to fileName or path basename) */
  displayName?: string;
}

export default function DocumentUpload({
  label = 'Profile PDF',
  value,
  onChange,
  helperText = 'Upload a PDF (max 20MB). It will download when users click the header button.',
  folder = 'files',
  fileName = 'bpc-profile.pdf',
  displayName = 'BPC Profile.pdf',
}: DocumentUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const uploadId = `doc-${inputId}`;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    const pending = getPendingPreview(uploadId);
    if (!pending && pendingName) {
      setPendingName(null);
    }
  }, [value, uploadId, pendingName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExt = ['pdf', 'doc', 'docx'];
    if (!allowedTypes.includes(file.type) && !allowedExt.includes(ext || '')) {
      setError('Invalid file type. Only PDF or Word documents are allowed.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('File size exceeds 20MB limit.');
      return;
    }

    setError(null);

    stageUpload({
      id: uploadId,
      file,
      folder,
      previousPath: valueRef.current,
      accept: 'document',
      fileName,
      applyPath: (path) => onChangeRef.current(path),
    });

    setPendingName(displayName || file.name);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = () => {
    setError(null);
    setPendingName(null);
    stageRemove({
      id: uploadId,
      previousPath: valueRef.current,
      applyPath: (path) => onChangeRef.current(path),
    });
  };

  const previewName =
    pendingName ||
    displayName ||
    fileName ||
    (value ? decodeURIComponent(value.split('/').pop()?.split('?')[0] || 'document.pdf') : '');

  const hasFile = Boolean(pendingName || value);

  return (
    <div>
      {label && (
        <label className="form-label fw-semibold mb-2" style={{ fontSize: '0.95rem' }}>
          {label}
        </label>
      )}

      <div className="d-flex flex-column gap-2">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf"
            onChange={handleFileChange}
            className="d-none"
            id={`doc-upload-${inputId}`}
          />
          <label
            htmlFor={`doc-upload-${inputId}`}
            className="btn btn-sm btn-secondary"
            style={{
              cursor: 'pointer',
              border: '1px solid #dee2e6',
              backgroundColor: '#f8f9fa',
              color: '#495057',
            }}
          >
            {hasFile ? 'Replace File' : 'Choose PDF'}
          </label>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 mb-0" style={{ fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {hasFile && (
          <div
            className="mt-1"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              background: '#f9fafb',
              maxWidth: 420,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#fee2e2',
                color: '#dc2626',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1 7V3.5L19.5 9H15zM8 13h8v2H8v-2zm0 4h8v2H8v-2zm0-8h5v2H8V9z" />
              </svg>
            </span>
            {value && !pendingName ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  minWidth: 0,
                  color: '#111827',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={previewName}
              >
                {previewName}
              </a>
            ) : (
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  color: '#111827',
                  fontSize: 14,
                  fontWeight: 500,
                }}
                title={previewName}
              >
                {previewName}
                <span className="text-muted" style={{ display: 'block', fontSize: 12, fontWeight: 400 }}>
                  Uploads on Save
                </span>
              </span>
            )}
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleRemove}>
              Remove
            </button>
          </div>
        )}

        {helperText && !hasFile && <small className="text-muted">{helperText}</small>}
      </div>
    </div>
  );
}
