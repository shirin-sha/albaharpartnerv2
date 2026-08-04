import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getUploadRoot, normalizeUploadFolder } from '@/lib/upload-path';

const IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'general';
    const accept = ((formData.get('accept') as string) || 'image').toLowerCase();

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    const isDocumentUpload = accept === 'document' || accept === 'file';

    if (isDocumentUpload) {
      const validType =
        DOCUMENT_TYPES.includes(file.type) || DOCUMENT_EXTENSIONS.includes(ext);
      if (!validType) {
        return NextResponse.json(
          { success: false, message: 'Invalid file type. Only PDF or Word documents are allowed.' },
          { status: 400 }
        );
      }
    } else if (!IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    const maxSize = isDocumentUpload ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: `File size exceeds ${isDocumentUpload ? '20MB' : '10MB'} limit`,
        },
        { status: 400 }
      );
    }

    const requestedName = ((formData.get('fileName') as string) || '').trim();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileExt = path.extname(originalName) || (isDocumentUpload ? '.pdf' : '');

    let fileName: string;
    if (requestedName) {
      // Fixed name (e.g. bpc-profile.pdf) — overwrite on re-upload, no random suffix
      const safe = requestedName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const hasExt = path.extname(safe).length > 0;
      fileName = hasExt ? safe : `${safe}${fileExt}`;
    } else {
      const timestamp = Date.now();
      const baseName = path.basename(originalName, path.extname(originalName));
      fileName = `${baseName}_${timestamp}${fileExt}`;
    }

    const uploadFolder = normalizeUploadFolder(folder);
    const uploadPath = path.join(getUploadRoot(), uploadFolder);
    const filePath = path.join(uploadPath, fileName);

    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const publicPath = `/api/uploads/${uploadFolder.replace(/\\/g, '/')}/${fileName}`;

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
