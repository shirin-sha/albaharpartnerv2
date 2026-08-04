import { flushSync } from 'react-dom';

export type PendingUploadEntry = {
  id: string;
  file: File | null;
  folder: string;
  previousPath: string;
  /** When true and file is null, clear path and delete previousPath on commit */
  remove: boolean;
  accept?: 'image' | 'document';
  fileName?: string;
  applyPath: (path: string) => void;
  previewUrl?: string;
};

const pendingEntries = new Map<string, PendingUploadEntry>();
const extraPathsToDelete = new Set<string>();

function isLocalUploadPath(path: string): boolean {
  if (!path || /^https?:\/\//i.test(path)) return false;
  if (path.startsWith('blob:')) return false;
  return (
    path.startsWith('/api/uploads/') ||
    path.startsWith('/image/') ||
    path.startsWith('api/uploads/') ||
    path.startsWith('image/')
  );
}

async function uploadFile(entry: PendingUploadEntry): Promise<string> {
  if (!entry.file) throw new Error('No file to upload');

  const formData = new FormData();
  formData.append('file', entry.file);
  formData.append('folder', entry.folder || 'general');
  if (entry.accept === 'document') {
    formData.append('accept', 'document');
  }
  if (entry.fileName) {
    formData.append('fileName', entry.fileName);
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();
  if (!result.success || !result.path) {
    throw new Error(result.message || 'Failed to upload file');
  }
  return result.path as string;
}

async function deleteStoredPath(imagePath: string) {
  if (!isLocalUploadPath(imagePath)) return;
  try {
    await fetch('/api/images/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath }),
    });
  } catch (err) {
    console.warn('Failed to delete file:', imagePath, err);
  }
}

function revokePreview(entry: PendingUploadEntry) {
  if (entry.previewUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(entry.previewUrl);
  }
}

/** Stage a new/replaced file (browser only — no server call). */
export function stageUpload(options: {
  id: string;
  file: File;
  folder?: string;
  previousPath?: string;
  accept?: 'image' | 'document';
  fileName?: string;
  applyPath: (path: string) => void;
}): string {
  const existing = pendingEntries.get(options.id);
  if (existing) revokePreview(existing);

  const previewUrl = URL.createObjectURL(options.file);
  const previousPath =
    options.previousPath && !options.previousPath.startsWith('blob:')
      ? options.previousPath
      : existing?.previousPath || '';

  pendingEntries.set(options.id, {
    id: options.id,
    file: options.file,
    folder: options.folder?.trim() || 'general',
    previousPath,
    remove: false,
    accept: options.accept || 'image',
    fileName: options.fileName,
    applyPath: options.applyPath,
    previewUrl,
  });

  return previewUrl;
}

/** Stage removal of an existing saved file (delete happens on commit). */
export function stageRemove(options: {
  id: string;
  previousPath?: string;
  applyPath: (path: string) => void;
}) {
  const existing = pendingEntries.get(options.id);
  if (existing) revokePreview(existing);

  const previousPath =
    options.previousPath && !options.previousPath.startsWith('blob:')
      ? options.previousPath
      : '';

  pendingEntries.set(options.id, {
    id: options.id,
    file: null,
    folder: 'general',
    previousPath,
    remove: true,
    applyPath: options.applyPath,
  });

  flushSync(() => options.applyPath(''));
}

/** Queue a path for delete on next commit (e.g. removing a logo row). */
export function queuePathForDelete(path: string) {
  if (isLocalUploadPath(path)) {
    extraPathsToDelete.add(path);
  }
}

export function hasPendingUploads(): boolean {
  return pendingEntries.size > 0 || extraPathsToDelete.size > 0;
}

export function getPendingPreview(id: string): string | undefined {
  return pendingEntries.get(id)?.previewUrl;
}

export function clearPendingEntry(id: string) {
  const existing = pendingEntries.get(id);
  if (existing) {
    revokePreview(existing);
    pendingEntries.delete(id);
  }
}

/**
 * Discard all staged files without uploading or deleting saved files.
 * Call on Cancel / form close.
 */
export function discardPendingUploads() {
  for (const entry of pendingEntries.values()) {
    revokePreview(entry);
  }
  pendingEntries.clear();
  extraPathsToDelete.clear();
}

/**
 * Upload staged files, apply real paths into form state, then delete replaced/removed files.
 * Call at the start of every admin Save handler.
 */
export async function commitPendingUploads(): Promise<void> {
  const entries = Array.from(pendingEntries.values());
  const toDelete = new Set<string>(extraPathsToDelete);

  for (const entry of entries) {
    if (entry.file) {
      const path = await uploadFile(entry);
      flushSync(() => entry.applyPath(path));
      if (entry.previousPath && entry.previousPath !== path) {
        toDelete.add(entry.previousPath);
      }
      revokePreview(entry);
    } else if (entry.remove) {
      flushSync(() => entry.applyPath(''));
      if (entry.previousPath) {
        toDelete.add(entry.previousPath);
      }
    }
  }

  pendingEntries.clear();
  extraPathsToDelete.clear();

  for (const path of toDelete) {
    await deleteStoredPath(path);
  }
}
