import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SolutionsContent } from '@/types/solutions';
import { revalidatePath } from 'next/cache';
import { extractImagePaths, deleteImageFiles } from '@/lib/image-utils';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'solutions';

// GET - Fetch Solutions content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'ltr';

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const content = await collection.findOne({ language }) as SolutionsContent | null;

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
    console.error('Error fetching Solutions content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch Solutions content',
    }, { status: 500 });
  }
}

// POST - Create new Solutions content
export async function POST(request: NextRequest) {
  try {
    const body: SolutionsContent = await request.json();

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

    // Revalidate pages that use solutions content
    revalidatePath('/');
    revalidatePath('/solutions');
    revalidatePath('/services-details-1');

    return NextResponse.json({
      success: true,
      message: 'Solutions content created successfully',
      data: { ...newContent, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating Solutions content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create Solutions content',
    }, { status: 500 });
  }
}

// PUT - Update existing Solutions content
export async function PUT(request: NextRequest) {
  try {
    const body: SolutionsContent = await request.json();

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
        message: 'Failed to update Solutions content',
      }, { status: 500 });
    }

    // Clean up old images that are no longer used
    if (oldDocument) {
      const oldImagePaths = extractImagePaths(oldDocument);
      const newImagePaths = extractImagePaths(updateData);
      
      // Find images that were in old but not in new
      const imagesToDelete = Array.from(oldImagePaths).filter(
        oldPath => !newImagePaths.has(oldPath) && !newImagePaths.has(oldPath.replace(/^\//, ''))
      );
      
      if (imagesToDelete.length > 0) {
        await deleteImageFiles(Array.from(imagesToDelete));
      }
    }

    // Revalidate pages that use solutions content
    revalidatePath('/');
    revalidatePath('/solutions');
    revalidatePath('/services-details-1');

    return NextResponse.json({
      success: true,
      message: 'Solutions content updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating Solutions content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update Solutions content',
    }, { status: 500 });
  }
}
