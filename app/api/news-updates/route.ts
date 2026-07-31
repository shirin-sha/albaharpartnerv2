import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { NewsUpdatesContent } from '@/types/news-updates';
import { revalidatePath, revalidateTag } from 'next/cache';
import { extractImagePaths, deleteImageFiles, cleanupUnusedImages } from '@/lib/image-utils';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'newsupdates';

// GET - Fetch News & Updates content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'ltr';

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const content = await collection.findOne({ language }) as NewsUpdatesContent | null;

    if (!content) {
      return NextResponse.json({
        success: false,
        message: 'No content found for this language',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Error fetching News & Updates content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch News & Updates content',
    }, { status: 500 });
  }
}

// POST - Create new News & Updates content
export async function POST(request: NextRequest) {
  try {
    const body: NewsUpdatesContent = await request.json();

    if (!body.language) {
      return NextResponse.json({
        success: false,
        message: 'Language is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Check if content already exists for this language
    const existing = await collection.findOne({ language: body.language });
    if (existing) {
      return NextResponse.json({
        success: false,
        message: `Content already exists for language: ${body.language}. Use PUT to update.`,
      }, { status: 409 });
    }

    const now = new Date();
    // Exclude _id so MongoDB can generate a proper ObjectId
    const { _id, ...bodyWithoutId } = body;
    const newContent = {
      ...bodyWithoutId,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(newContent);

    // Revalidate pages that use news-updates content
    revalidatePath('/');
    revalidatePath('/news-updates');
    revalidatePath('/ar/news-updates');
    revalidateTag(`cms-content-newsupdates-${body.language}`);

    return NextResponse.json({
      success: true,
      message: 'News & Updates content created successfully',
      data: { ...newContent, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating News & Updates content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create News & Updates content',
    }, { status: 500 });
  }
}

// PUT - Update existing News & Updates content
export async function PUT(request: NextRequest) {
  try {
    const body: NewsUpdatesContent = await request.json();

    if (!body.language) {
      return NextResponse.json({
        success: false,
        message: 'Language is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Get old document to find images that need to be deleted
    const oldDocument = await collection.findOne({ language: body.language });

    const { _id, createdAt, ...updateData } = body;
    const updatedContent = {
      ...updateData,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { language: body.language },
      { $set: updatedContent },
      { returnDocument: 'after', upsert: true }
    );

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Failed to update News & Updates content',
      }, { status: 500 });
    }

    // Clean up old images that are no longer used
    if (oldDocument) {
      await cleanupUnusedImages(oldDocument, updateData);
    }

    // Revalidate pages that use news-updates content
    revalidatePath('/');
    revalidatePath('/news-updates');
    revalidatePath('/ar/news-updates');
    revalidateTag(`cms-content-newsupdates-${body.language}`);

    return NextResponse.json({
      success: true,
      message: 'News & Updates content updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating News & Updates content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update News & Updates content',
    }, { status: 500 });
  }
}
