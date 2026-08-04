'use client';
import { useId, useRef, useState } from 'react';

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

async function deleteStoredFile(filePath: string) {
  if (!filePath || /^https?:\/\//i.test(filePath)) return;
  try {
    await fetch('/api/images/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath: filePath }),
    });
  } catch (err) {
    console.warn('Failed to delete previous file:', filePath, err);
  }
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setUploading(true);
    const previousPath = value;

    try {
      // Remove previous file first so re-upload always replaces the old one
      if (previousPath) {
        await deleteStoredFile(previousPath);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('accept', 'document');
      if (fileName) formData.append('fileName', fileName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.success && result.path) {
        onChange(result.path);
      } else {
        setError(result.message || 'Failed to upload file');
      }
    } catch (err) {
      console.error('Document upload error:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    const previousPath = value;
    onChange('');
    setError(null);
    if (previousPath) await deleteStoredFile(previousPath);
  };

  const previewName =
    displayName ||
    fileName ||
    (value ? decodeURIComponent(value.split('/').pop()?.split('?')[0] || 'document.pdf') : '');

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
            disabled={uploading}
            className="d-none"
            id={`doc-upload-${inputId}`}
          />
          <label
            htmlFor={`doc-upload-${inputId}`}
            className="btn btn-sm btn-secondary"
            style={{
              cursor: uploading ? 'not-allowed' : 'pointer',
              border: '1px solid #dee2e6',
              backgroundColor: '#f8f9fa',
              color: '#495057',
            }}
          >
            {uploading ? 'Uploading...' : value ? 'Replace File' : 'Choose & Upload PDF'}
          </label>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 mb-0" style={{ fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {value && (
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
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                void handleRemove();
              }}
            >
              Remove
            </button>
          </div>
        )}

        {helperText && !value && <small className="text-muted">{helperText}</small>}
      </div>
    </div>
  );
}
