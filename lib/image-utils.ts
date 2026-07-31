import { unlink, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getUploadRoot, resolveUploadFile } from '@/lib/upload-path';

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
    if (!imagePath) continue;

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

function normalizeImagePathKey(imagePath: string): string {
  return imagePath
    .replace(/^\/api\/uploads\//, '/image/')
    .replace(/^api\/uploads\//, '/image/')
    .replace(/^\//, '');
}

/**
 * Delete image files present in oldData but not in newData.
 */
export async function cleanupUnusedImages(
  oldData: unknown,
  newData: unknown
): Promise<{ deleted: number; failed: number; notFound: number }> {
  const oldImagePaths = extractImagePaths(oldData);
  const newImagePaths = extractImagePaths(newData);
  const newKeys = new Set(Array.from(newImagePaths).map(normalizeImagePathKey));

  const imagesToDelete = Array.from(oldImagePaths).filter((oldPath) => {
    return !newImagePaths.has(oldPath) && !newKeys.has(normalizeImagePathKey(oldPath));
  });

  if (imagesToDelete.length === 0) {
    return { deleted: 0, failed: 0, notFound: 0 };
  }

  return deleteImageFiles(imagesToDelete);
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
