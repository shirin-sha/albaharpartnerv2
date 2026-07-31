import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { CustomerStoriesContent } from '@/types/customer-stories';
import { revalidatePath } from 'next/cache';
import { extractImagePaths, deleteImageFiles, cleanupUnusedImages } from '@/lib/image-utils';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'customerstories';

// GET - Fetch Customer Stories content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'ltr';

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const content = await collection.findOne({ language }) as CustomerStoriesContent | null;

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
    console.error('Error fetching Customer Stories content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch Customer Stories content',
    }, { status: 500 });
  }
}

// POST - Create new Customer Stories content
export async function POST(request: NextRequest) {
  try {
    const body: CustomerStoriesContent = await request.json();

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

    // Revalidate pages that use customer-stories content
    revalidatePath('/');
    revalidatePath('/customer-stories');

    return NextResponse.json({
      success: true,
      message: 'Customer Stories content created successfully',
      data: { ...newContent, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating Customer Stories content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create Customer Stories content',
    }, { status: 500 });
  }
}

// PUT - Update existing Customer Stories content
export async function PUT(request: NextRequest) {
  try {
    const body: CustomerStoriesContent = await request.json();

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
        message: 'Failed to update Customer Stories content',
      }, { status: 500 });
    }

    // Clean up old images that are no longer used
    if (oldDocument) {
      await cleanupUnusedImages(oldDocument, updateData);
    }

    // Revalidate pages that use customer-stories content
    revalidatePath('/');
    revalidatePath('/customer-stories');

    return NextResponse.json({
      success: true,
      message: 'Customer Stories content updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating Customer Stories content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update Customer Stories content',
    }, { status: 500 });
  }
}
