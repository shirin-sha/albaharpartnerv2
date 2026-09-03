import { flushSync } from 'react-dom';

export type PendingUploadEntry = {
  id: string;
  file: File | null;
  folder: string;
  previousPath: string;
  /** When true and file is null, clear path and delete previousPath on finalize */
  remove: boolean;
  accept?: 'image' | 'document';
  fileName?: string;
  applyPath: (path: string) => void;
  previewUrl?: string;
};

type UploadSession = {
  uploadedPaths: string[];
  previousPaths: string[];
  restorations: Array<{ applyPath: (path: string) => void; previousPath: string }>;
};

const pendingEntries = new Map<string, PendingUploadEntry>();
const extraPathsToDelete = new Set<string>();
let activeSession: UploadSession | null = null;

/** Only CMS uploads may be deleted — never theme/seed files under /image/. */
export function isManagedUploadPath(path: string): boolean {
  if (!path || /^https?:\/\//i.test(path) || path.startsWith('blob:')) return false;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return normalized.startsWith('/api/uploads/');
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
  if (!isManagedUploadPath(imagePath)) return;
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

function queuePreviousPath(session: UploadSession, path: string) {
  if (isManagedUploadPath(path) && !session.previousPaths.includes(path)) {
    session.previousPaths.push(path);
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

/** Stage removal of an existing saved file (delete happens on finalize). */
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

/** Queue a path for delete on next successful save (e.g. removing a logo row). */
export function queuePathForDelete(path: string) {
  if (isManagedUploadPath(path)) {
    extraPathsToDelete.add(path);
  }
}

export function hasPendingUploads(): boolean {
  return pendingEntries.size > 0 || extraPathsToDelete.size > 0 || activeSession !== null;
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
 * Upload staged files and apply real paths into form state.
 * Does not delete replaced files — call finalizeCommittedUploads after CMS save succeeds,
 * or rollbackCommittedUploads if it fails.
 */
export async function commitPendingUploads(): Promise<void> {
  if (activeSession) {
    await rollbackCommittedUploads();
  }

  const entries = Array.from(pendingEntries.values());
  const session: UploadSession = {
    uploadedPaths: [],
    previousPaths: [],
    restorations: [],
  };

  try {
    for (const entry of entries) {
      if (entry.file) {
        const path = await uploadFile(entry);
        session.uploadedPaths.push(path);
        session.restorations.push({ applyPath: entry.applyPath, previousPath: entry.previousPath });
        flushSync(() => entry.applyPath(path));
        if (entry.previousPath && entry.previousPath !== path) {
          queuePreviousPath(session, entry.previousPath);
        }
        revokePreview(entry);
      } else if (entry.remove) {
        session.restorations.push({ applyPath: entry.applyPath, previousPath: entry.previousPath });
        flushSync(() => entry.applyPath(''));
        queuePreviousPath(session, entry.previousPath);
      }
    }

    for (const path of extraPathsToDelete) {
      queuePreviousPath(session, path);
    }

    pendingEntries.clear();
    extraPathsToDelete.clear();
    activeSession = session;
  } catch (err) {
    for (const path of session.uploadedPaths) {
      await deleteStoredPath(path);
    }
    for (const restoration of session.restorations) {
      flushSync(() => restoration.applyPath(restoration.previousPath));
    }
    activeSession = null;
    throw err;
  }
}

/** Delete replaced/removed files after the CMS save succeeded. */
export async function finalizeCommittedUploads(): Promise<void> {
  if (!activeSession) return;
  const { previousPaths } = activeSession;
  activeSession = null;
  for (const path of previousPaths) {
    await deleteStoredPath(path);
  }
}

/** Delete newly uploaded files and restore previous form paths after a failed save. */
export async function rollbackCommittedUploads(): Promise<void> {
  if (!activeSession) return;
  const { uploadedPaths, restorations } = activeSession;
  activeSession = null;
  for (const path of uploadedPaths) {
    await deleteStoredPath(path);
  }
  for (const restoration of restorations) {
    flushSync(() => restoration.applyPath(restoration.previousPath));
  }
}

/**
 * One language saved and the other failed. Keep both old and new files
 * (each is still referenced) and retry-delete old files on the next successful save.
 */
function parkPreviousPathsForRetry() {
  if (!activeSession) return;
  for (const path of activeSession.previousPaths) {
    extraPathsToDelete.add(path);
  }
  activeSession = null;
}

export async function deleteManagedUpload(imagePath: string): Promise<void> {
  await deleteStoredPath(imagePath);
}

export function bilingualSaveOutcome(ltrOk?: boolean, rtlOk?: boolean): boolean | 'partial' {
  if (ltrOk && rtlOk) return true;
  if (ltrOk || rtlOk) return 'partial';
  return false;
}

/**
 * Upload pending files, persist CMS content, then finalize or roll back.
 * `persist` should return true when the CMS write succeeded.
 */
export async function saveWithPendingUploads(
  persist: () => Promise<boolean | 'partial'>,
): Promise<boolean> {
  await commitPendingUploads();
  try {
    const outcome = await persist();
    if (outcome === true) {
      await finalizeCommittedUploads();
      return true;
    }
    if (outcome === 'partial') {
      parkPreviousPathsForRetry();
      return false;
    }
    await rollbackCommittedUploads();
    return false;
  } catch (err) {
    await rollbackCommittedUploads();
    throw err;
  }
}
