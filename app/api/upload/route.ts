import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getUploadRoot, normalizeUploadFolder } from '@/lib/upload-path';
import { deleteImageFile } from '@/lib/image-utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'general';
    const previousPath = (formData.get('previousPath') as string) || '';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const fileName = `${baseName}_${timestamp}${ext}`;

    const uploadFolder = normalizeUploadFolder(folder);
    const uploadPath = path.join(getUploadRoot(), uploadFolder);
    const filePath = path.join(uploadPath, fileName);

    console.log('[api/upload] request', {
      requestedFolder: folder,
      normalizedFolder: uploadFolder,
      uploadRoot: getUploadRoot(),
      resolvedDirectory: uploadPath,
      targetFilePath: filePath,
      previousPath: previousPath || null,
    });

    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const publicPath = `/api/uploads/${uploadFolder.replace(/\\/g, '/')}/${fileName}`;

    // Delete previous image after successful replace (covers all admin sections using ImageUpload)
    if (previousPath && previousPath !== publicPath) {
      await deleteImageFile(previousPath);
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      path: publicPath,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
