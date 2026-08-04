'use client';
import { useState, useRef, useId, useEffect } from 'react';
import {
  stageUpload,
  stageRemove,
  getPendingPreview,
} from '@/lib/pending-uploads';

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  className?: string;
  folder?: string;
  required?: boolean;
}

function normalizeUploadFolder(pathValue: string, fallbackFolder?: string): string {
  if (!pathValue) return fallbackFolder || 'general';

  const parts = pathValue
    .split('/')
    .filter(Boolean)
    .filter((part) => part !== '.' && part !== '..');

  while (
    parts.length > 0 &&
    (parts[0] === 'api' || parts[0] === 'uploads' || parts[0] === 'image')
  ) {
    if (parts[0] === 'api' && parts[1] === 'uploads') {
      parts.splice(0, 2);
      continue;
    }
    parts.shift();
  }

  return parts[0] || fallbackFolder || 'general';
}

export default function ImageUpload({
  label,
  value,
  onChange,
  helperText,
  className = '',
  folder,
  required = false,
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const uploadId = `img-${inputId}`;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    // Sync preview if parent discarded pending uploads (e.g. Cancel)
    const pending = getPendingPreview(uploadId);
    if (!pending && previewUrl?.startsWith('blob:')) {
      setPreviewUrl(null);
    }
  }, [value, uploadId, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only images (JPEG, PNG, GIF, WebP, SVG) are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    setError(null);

    const uploadFolder =
      folder || normalizeUploadFolder(valueRef.current) || 'general';

    const blobUrl = stageUpload({
      id: uploadId,
      file,
      folder: uploadFolder,
      previousPath: valueRef.current,
      accept: 'image',
      applyPath: (path) => onChangeRef.current(path),
    });

    setPreviewUrl(blobUrl);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setError(null);
    setPreviewUrl(null);
    stageRemove({
      id: uploadId,
      previousPath: valueRef.current,
      applyPath: (path) => onChangeRef.current(path),
    });
  };

  const displaySrc =
    previewUrl ||
    (value.startsWith('/image/')
      ? value.replace('/image/', '/api/uploads/')
      : value);

  const hasImage = Boolean(previewUrl || value);

  return (
    <div className={className}>
      {label && (
        <label className="form-label fw-semibold mb-2" style={{ fontSize: '0.95rem' }}>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      <div className="d-flex flex-column gap-2">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="d-none"
            id={`file-upload-${label?.replace(/\s+/g, '-') || 'image'}-${inputId}`}
          />
          <label
            htmlFor={`file-upload-${label?.replace(/\s+/g, '-') || 'image'}-${inputId}`}
            className="btn btn-sm btn-secondary"
            style={{
              cursor: 'pointer',
              border: '1px solid #dee2e6',
              backgroundColor: '#f8f9fa',
              color: '#495057',
            }}
          >
            {hasImage ? 'Replace Image' : 'Choose Image'}
          </label>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 mb-0" style={{ fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {hasImage && displaySrc && (
          <div className="mt-2">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-muted small">
                {previewUrl ? 'Selected (uploads on Save):' : 'Current image:'}
              </span>
              {!previewUrl && value && (
                <code className="small px-2 py-1 rounded">{value}</code>
              )}
              {previewUrl && (
                <span className="small text-muted">Not saved to server yet</span>
              )}
            </div>
            <div style={{ maxWidth: '300px', position: 'relative', display: 'inline-block' }}>
              <img
                src={displaySrc}
                alt="Preview"
                className="img-fluid rounded"
                style={{ maxHeight: '200px', width: 'auto' }}
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
                }}
              />
              {!required && (
                <div
                  onClick={handleRemove}
                  title="Remove image"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '4px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dc3545"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}

        {helperText && <small className="text-muted">{helperText}</small>}
      </div>
    </div>
  );
}
