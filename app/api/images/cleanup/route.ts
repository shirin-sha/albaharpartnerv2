import { NextRequest, NextResponse } from 'next/server';
import {
  extractImagePaths,
  deleteImageFiles,
  getAllManagedUploadFiles,
  findOrphanedUploads,
} from '@/lib/image-utils';
import { getDatabase } from '@/lib/mongodb';

const CMS_COLLECTIONS = [
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
  'customer-care-center',
  'career_applications',
];

/**
 * POST /api/images/cleanup
 * Find and optionally delete orphaned CMS uploads (not referenced in the database).
 * Query params:
 *   - dryRun: if true, only report orphaned images without deleting (default: true)
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dryRun = searchParams.get('dryRun') !== 'false';

    const allManagedFiles = await getAllManagedUploadFiles();

    const db = await getDatabase();
    const usedImagePaths = new Set<string>();

    for (const collectionName of CMS_COLLECTIONS) {
      try {
        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();

        documents.forEach((doc) => {
          const imagePaths = extractImagePaths(doc);
          imagePaths.forEach((imgPath) => usedImagePaths.add(imgPath));
        });
      } catch (error) {
        console.error(`Error reading collection ${collectionName}:`, error);
      }
    }

    const orphanedImages = findOrphanedUploads(allManagedFiles, usedImagePaths);

    let deleteResults = null;
    if (!dryRun && orphanedImages.length > 0) {
      deleteResults = await deleteImageFiles(orphanedImages);
    }

    return NextResponse.json({
      success: true,
      dryRun,
      totalImages: allManagedFiles.length,
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
  const response = await POST(new NextRequest(request.url, { method: 'POST' }));
  return response;
}
