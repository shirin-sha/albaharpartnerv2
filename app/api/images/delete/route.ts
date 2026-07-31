import { NextRequest, NextResponse } from 'next/server';
import { deleteImageFile } from '@/lib/image-utils';

/**
 * DELETE /api/images/delete
 * Delete a single image file
 * Body: { imagePath: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { imagePath } = body;

    if (!imagePath) {
      return NextResponse.json(
        { success: false, message: 'Image path is required' },
        { status: 400 }
      );
    }

    const deleted = await deleteImageFile(imagePath);

    return NextResponse.json({
      success: true,
      deleted,
      message: deleted ? 'Image deleted successfully' : 'Image not found or already deleted',
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/images/delete
 * Delete multiple image files
 * Body: { imagePaths: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imagePaths } = body;

    if (!Array.isArray(imagePaths)) {
      return NextResponse.json(
        { success: false, message: 'imagePaths must be an array' },
        { status: 400 }
      );
    }

    const { deleteImageFiles } = await import('@/lib/image-utils');
    const results = await deleteImageFiles(imagePaths);

    return NextResponse.json({
      success: true,
      message: `Deleted ${results.deleted} images`,
      results,
    });
  } catch (error) {
    console.error('Error deleting images:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete images' },
      { status: 500 }
    );
  }
}
