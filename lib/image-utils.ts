import { unlink, readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

/**
 * Convert image path (e.g., /image/hero/slide-1.jpg) to filesystem path
 */
export function imagePathToFilePath(imagePath: string): string | null {
  if (!imagePath) return null;
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Check if it's an image path
  if (!cleanPath.startsWith('image/')) return null;
  
  // Convert to filesystem path
  return path.join(process.cwd(), 'public', cleanPath);
}

/**
 * Delete an image file from the filesystem
 */
export async function deleteImageFile(imagePath: string): Promise<boolean> {
  try {
    const filePath = imagePathToFilePath(imagePath);
    if (!filePath || !existsSync(filePath)) {
      return false; // File doesn't exist, consider it deleted
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
      const filePath = imagePathToFilePath(imagePath);
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
    // Check if it's an image path
    if (obj.startsWith('/image/') || obj.startsWith('image/')) {
      paths.add(obj);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractImagePaths(item, paths));
  } else if (typeof obj === 'object') {
    Object.values(obj).forEach(value => extractImagePaths(value, paths));
  }

  return paths;
}

/**
 * Get all image files in a directory recursively
 */
export async function getAllImageFiles(dirPath: string): Promise<string[]> {
  const imageFiles: string[] = [];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        const subFiles = await getAllImageFiles(fullPath);
        imageFiles.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (imageExtensions.includes(ext)) {
          // Convert to public path format
          const relativePath = fullPath.replace(process.cwd() + path.sep + 'public' + path.sep, '');
          imageFiles.push('/' + relativePath.replace(/\\/g, '/'));
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return imageFiles;
}
