import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { resolveUploadFile } from '@/lib/upload-path';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function isSafePath(segments: string[]): boolean {
  return segments.every((segment) => segment && !segment.includes('..') && !path.isAbsolute(segment));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ segments: string[] }> }
) {
  try {
    const { segments } = await params;

    if (!segments?.length || !isSafePath(segments)) {
      return NextResponse.json({ success: false, message: 'Invalid file path' }, { status: 400 });
    }

    const resolved = await resolveUploadFile(segments);

    console.log('[api/uploads] request', {
      requestedUrl: request.nextUrl.pathname,
      requestedPath: resolved.requestedPath,
      uploadRoot: resolved.rootDir,
      candidatePaths: resolved.candidates.map((candidate) => path.join(resolved.rootDir, candidate)),
      resolvedPath: resolved.resolvedPath,
      exists: resolved.exists,
    });

    if (!resolved.resolvedPath) {
      return NextResponse.json({ success: false, message: 'File not found' }, { status: 404 });
    }

    const ext = path.extname(resolved.resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = await readFile(resolved.resolvedPath);
    const body = new Uint8Array(fileBuffer);

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return NextResponse.json({ success: false, message: 'Failed to serve file' }, { status: 500 });
  }
}

