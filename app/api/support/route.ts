import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SupportContent } from '@/types/support';
import { revalidatePath } from 'next/cache';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'support';

// GET - Fetch Support content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'ltr';

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const content = await collection.findOne({ language }) as SupportContent | null;

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
    console.error('Error fetching Support content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch Support content',
    }, { status: 500 });
  }
}

// POST - Create new Support content
export async function POST(request: NextRequest) {
  try {
    const body: SupportContent = await request.json();

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

    // Revalidate support page
    revalidatePath('/support');
    revalidatePath('/ar/support');

    return NextResponse.json({
      success: true,
      message: 'Support content created successfully',
      data: { ...newContent, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating Support content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create Support content',
    }, { status: 500 });
  }
}

// PUT - Update existing Support content
export async function PUT(request: NextRequest) {
  try {
    const body: SupportContent = await request.json();

    if (!body.language) {
      return NextResponse.json({
        success: false,
        message: 'Language is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

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
        message: 'Failed to update Support content',
      }, { status: 500 });
    }

    // Revalidate support page
    revalidatePath('/support');
    revalidatePath('/ar/support');

    return NextResponse.json({
      success: true,
      message: 'Support content updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating Support content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update Support content',
    }, { status: 500 });
  }
}
