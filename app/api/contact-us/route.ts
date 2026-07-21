import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ContactUsContent } from '@/types/contact-us';
import { revalidatePath } from 'next/cache';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'contactus';

// GET - Fetch Contact Us content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'ltr';

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const content = await collection.findOne({ language }) as ContactUsContent | null;

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
    console.error('Error fetching Contact Us content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch Contact Us content',
    }, { status: 500 });
  }
}

// POST - Create new Contact Us content
export async function POST(request: NextRequest) {
  try {
    const body: ContactUsContent = await request.json();

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

    // Revalidate contact-us page
    revalidatePath('/contact-us');

    return NextResponse.json({
      success: true,
      message: 'Contact Us content created successfully',
      data: { ...newContent, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating Contact Us content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create Contact Us content',
    }, { status: 500 });
  }
}

// PUT - Update existing Contact Us content
export async function PUT(request: NextRequest) {
  try {
    const body: ContactUsContent = await request.json();

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
        message: 'Failed to update Contact Us content',
      }, { status: 500 });
    }

    // Revalidate contact-us page
    revalidatePath('/contact-us');

    return NextResponse.json({
      success: true,
      message: 'Contact Us content updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating Contact Us content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update Contact Us content',
    }, { status: 500 });
  }
}
