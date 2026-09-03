import { unlink, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getUploadRoot, resolveUploadFile } from '@/lib/upload-path';

/** CMS-uploaded files only. Theme/seed assets under `/image/` must never be deleted. */
export function isManagedUploadPath(imagePath: string): boolean {
  if (!imagePath || /^https?:\/\//i.test(imagePath) || imagePath.startsWith('blob:')) {
    return false;
  }
  const normalized = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return normalized.startsWith('/api/uploads/');
}

/** Unique CMS uploads use `name_<timestamp>.ext` — never delete theme files that lack this. */
export function isTimestampedUploadFile(fileName: string): boolean {
  return /_\d{10,}(?:\.[a-z0-9]+)?$/i.test(fileName);
}

/**
 * Convert a public/CMS image path to an absolute filesystem path under the upload root.
 * Supports both `/image/...` and `/api/uploads/...`.
 */
export async function imagePathToFilePath(imagePath: string): Promise<string | null> {
  if (!imagePath) return null;

  // External URLs are never local upload files
  if (/^https?:\/\//i.test(imagePath)) return null;

  const resolved = await resolveUploadFile(imagePath);
  if (!resolved.resolvedPath) return null;

  const rootDir = path.resolve(resolved.rootDir);
  const filePath = path.resolve(resolved.resolvedPath);

  // Prevent path traversal outside the upload root
  const rootWithSep = rootDir.endsWith(path.sep) ? rootDir : rootDir + path.sep;
  if (filePath !== rootDir && !filePath.startsWith(rootWithSep)) {
    return null;
  }

  return filePath;
}

/**
 * Delete an image file from the filesystem
 */
export async function deleteImageFile(imagePath: string): Promise<boolean> {
  if (!isManagedUploadPath(imagePath)) {
    return false;
  }

  try {
    const filePath = await imagePathToFilePath(imagePath);
    if (!filePath || !existsSync(filePath)) {
      return false;
    }

    await unlink(filePath);
    return true;
  } catch (error) {
    console.error(`Error deleting image ${imagePath}:`, error);
    return false;
  }
}

/**
 * Delete multiple image files
 */
export async function deleteImageFiles(imagePaths: string[]): Promise<{
  deleted: number;
  failed: number;
  notFound: number;
}> {
  const results = {
    deleted: 0,
    failed: 0,
    notFound: 0,
  };

  for (const imagePath of imagePaths) {
    if (!imagePath || !isManagedUploadPath(imagePath)) continue;

    try {
      const filePath = await imagePathToFilePath(imagePath);
      if (!filePath || !existsSync(filePath)) {
        results.notFound++;
        continue;
      }

      await unlink(filePath);
      results.deleted++;
    } catch (error) {
      console.error(`Error deleting image ${imagePath}:`, error);
      results.failed++;
    }
  }

  return results;
}

/**
 * Extract all image paths from an object recursively
 */
export function extractImagePaths(obj: any, paths: Set<string> = new Set()): Set<string> {
  if (!obj) return paths;

  if (typeof obj === 'string') {
    if (
      obj.startsWith('/image/') ||
      obj.startsWith('image/') ||
      obj.startsWith('/api/uploads/') ||
      obj.startsWith('api/uploads/')
    ) {
      paths.add(obj);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item) => extractImagePaths(item, paths));
  } else if (typeof obj === 'object') {
    Object.values(obj).forEach((value) => extractImagePaths(value, paths));
  }

  return paths;
}

export async function deleteReferencedUploads(obj: unknown): Promise<void> {
  const paths = Array.from(extractImagePaths(obj)).filter(isManagedUploadPath);
  if (paths.length > 0) {
    await deleteImageFiles(paths);
  }
}

export async function deleteUnusedManagedUploads(
  oldDocument: unknown,
  newDocument: unknown,
  otherDocuments: unknown[] = [],
): Promise<void> {
  const oldImagePaths = extractImagePaths(oldDocument);
  const newImagePaths = extractImagePaths(newDocument);
  const usedElsewhere = new Set<string>();
  for (const doc of otherDocuments) {
    extractImagePaths(doc, usedElsewhere);
  }

  const imagesToDelete = Array.from(oldImagePaths).filter((oldPath) => {
    if (!isManagedUploadPath(oldPath)) return false;
    if (newImagePaths.has(oldPath) || newImagePaths.has(oldPath.replace(/^\//, ''))) {
      return false;
    }
    return !pathIsReferenced(oldPath, usedElsewhere);
  });

  if (imagesToDelete.length > 0) {
    await deleteImageFiles(imagesToDelete);
  }
}

function pathIsReferenced(filePath: string, used: Set<string>): boolean {
  const withoutSlash = filePath.replace(/^\//, '');
  const asImage = filePath.replace('/api/uploads/', '/image/');
  const asImageNoSlash = asImage.replace(/^\//, '');
  return (
    used.has(filePath) ||
    used.has(withoutSlash) ||
    used.has(asImage) ||
    used.has(asImageNoSlash)
  );
}

/**
 * Timestamped CMS uploads under the upload root, as `/api/uploads/...` paths.
 */
export async function getAllManagedUploadFiles(
  dirPath: string = getUploadRoot(),
): Promise<string[]> {
  const files: string[] = [];
  const allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
    '.pdf',
    '.doc',
    '.docx',
  ];
  const uploadRoot = getUploadRoot();

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        files.push(...(await getAllManagedUploadFiles(fullPath)));
        continue;
      }

      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!allowedExtensions.includes(ext) || !isTimestampedUploadFile(entry.name)) {
        continue;
      }

      const relativeFromUpload = path.relative(uploadRoot, fullPath).replace(/\\/g, '/');
      if (relativeFromUpload && !relativeFromUpload.startsWith('..')) {
        files.push(`/api/uploads/${relativeFromUpload}`);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return files;
}

export function findOrphanedUploads(
  filesOnDisk: string[],
  usedImagePaths: Set<string>,
): string[] {
  return filesOnDisk.filter((filePath) => !pathIsReferenced(filePath, usedImagePaths));
}

/**
 * Get all image files in a directory recursively (as public `/image/...` paths when under public/)
 */
export async function getAllImageFiles(dirPath: string): Promise<string[]> {
  const imageFiles: string[] = [];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const uploadRoot = getUploadRoot();

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await getAllImageFiles(fullPath);
        imageFiles.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (!imageExtensions.includes(ext)) continue;

        const relativeFromUpload = path.relative(uploadRoot, fullPath).replace(/\\/g, '/');
        if (relativeFromUpload && !relativeFromUpload.startsWith('..')) {
          imageFiles.push(`/api/uploads/${relativeFromUpload}`);
          continue;
        }

        const relativeFromPublic = fullPath
          .replace(process.cwd() + path.sep + 'public' + path.sep, '')
          .replace(/\\/g, '/');
        if (relativeFromPublic && !path.isAbsolute(relativeFromPublic)) {
          imageFiles.push('/' + relativeFromPublic);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return imageFiles;
}
