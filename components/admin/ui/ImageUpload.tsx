'use client';
import { useState, useRef, useId } from 'react';

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  className?: string;
  folder?: string; // Optional folder path (e.g., 'hero', 'blog', 'brand')
  required?: boolean; // Make the field required
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

async function deleteStoredImage(imagePath: string) {
  if (!imagePath || /^https?:\/\//i.test(imagePath)) return;

  try {
    await fetch('/api/images/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath }),
    });
  } catch (err) {
    console.warn('Failed to delete old image file:', imagePath, err);
  }
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  // Extract folder from existing value if not provided
  const getFolderFromValue = (path: string): string => {
    return normalizeUploadFolder(path, folder);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only images (JPEG, PNG, GIF, WebP, SVG) are allowed.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    setError(null);
    setUploading(true);

    const previousPath = value;

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Determine folder: use prop, or extract from existing value, or default to 'general'
      const uploadFolder = folder || getFolderFromValue(value) || 'general';
      formData.append('folder', uploadFolder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onChange(result.path);
        setError(null);

        // Remove previous file after successful replace
        if (previousPath && previousPath !== result.path) {
          await deleteStoredImage(previousPath);
        }
      } else {
        setError(result.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    const previousPath = value;
    onChange('');
    setError(null);
    if (previousPath) {
      await deleteStoredImage(previousPath);
    }
  };

  const resolvedImageSrc = value.startsWith('/image/')
    ? value.replace('/image/', '/api/uploads/')
    : value;

  return (
    <div className={className}>
      {label && (
        <label className="form-label fw-semibold mb-2" style={{ fontSize: '0.95rem' }}>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      <div className="d-flex flex-column gap-2">
        {/* File Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={handleFileChange}
            disabled={uploading}
            className="d-none"
            id={`file-upload-${label?.replace(/\s+/g, '-') || 'image'}-${inputId}`}
          />
          <label
            htmlFor={`file-upload-${label?.replace(/\s+/g, '-') || 'image'}-${inputId}`}
            className={`btn btn-sm btn-secondary`}
            style={{
              cursor: uploading ? 'not-allowed' : 'pointer',
              border: '1px solid #dee2e6',
              backgroundColor: '#f8f9fa',
              color: '#495057',
            }}
          >
            {uploading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Uploading...
              </>
            ) : (
              value ? 'Replace Image' : 'Choose & Upload Image'
            )}
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger py-2 px-3 mb-0" style={{ fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Current Image Display */}
        {value && (
          <div className="mt-2">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="text-muted small">Current image:</span>
              <code className="small px-2 py-1 rounded">{value}</code>
            </div>
            <div style={{ maxWidth: '300px', position: 'relative', display: 'inline-block' }}>
              <img
                src={resolvedImageSrc}
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
                  onClick={() => {
                    void handleRemove();
                  }}
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

        {/* Helper Text — always visible so recommended sizes stay after upload */}
        {helperText && (
          <small className="text-muted">{helperText}</small>
        )}
      </div>
    </div>
  );
}
