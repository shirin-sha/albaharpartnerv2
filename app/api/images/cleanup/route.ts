import { NextRequest, NextResponse } from 'next/server';
import { getAllImageFiles, extractImagePaths, deleteImageFiles } from '@/lib/image-utils';
import { getDatabase } from '@/lib/mongodb';
import path from 'path';

/**
 * POST /api/images/cleanup
 * Find and optionally delete orphaned images (images not referenced in database)
 * Query params:
 *   - dryRun: if true, only report orphaned images without deleting (default: true)
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dryRun = searchParams.get('dryRun') !== 'false'; // Default to true for safety

    // Get all image files from filesystem
    const imagesDir = path.join(process.cwd(), 'public', 'image');
    const allImageFiles = await getAllImageFiles(imagesDir);

    // Get all image paths from database
    const db = await getDatabase();
    const usedImagePaths = new Set<string>();

    // Collect images from all collections
    const collections = [
      'homepage',
      'newsupdates',
      'aboutus',
      'solutions',
      'customerstories',
      'brands',
      'contactus',
      'support',
      'careers',
      'header',
      'footer',
      // Add other collections that might contain images
    ];

    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();
        
        documents.forEach(doc => {
          const imagePaths = extractImagePaths(doc);
          imagePaths.forEach(imgPath => usedImagePaths.add(imgPath));
        });
      } catch (error) {
        console.error(`Error reading collection ${collectionName}:`, error);
      }
    }

    // Find orphaned images
    const orphanedImages = allImageFiles.filter(
      imgPath => !usedImagePaths.has(imgPath) && !usedImagePaths.has(imgPath.replace(/^\//, ''))
    );

    let deleteResults = null;
    if (!dryRun && orphanedImages.length > 0) {
      // Actually delete the orphaned images
      deleteResults = await deleteImageFiles(orphanedImages);
    }

    return NextResponse.json({
      success: true,
      dryRun,
      totalImages: allImageFiles.length,
      usedImages: usedImagePaths.size,
      orphanedImages: orphanedImages.length,
      orphanedImagePaths: orphanedImages,
      deleteResults,
      message: dryRun
        ? `Found ${orphanedImages.length} orphaned images (dry run - no files deleted)`
        : `Deleted ${deleteResults?.deleted || 0} orphaned images`,
    });
  } catch (error) {
    console.error('Error cleaning up images:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to cleanup images',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/images/cleanup
 * Get report of orphaned images without deleting
 */
export async function GET(request: NextRequest) {
  const response = await POST(
    new NextRequest(request.url, { method: 'POST' })
  );
  return response;
}
