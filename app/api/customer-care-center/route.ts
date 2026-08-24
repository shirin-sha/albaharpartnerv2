import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { CustomerCareContent } from '@/types/customer-care-center';
import { revalidatePath, revalidateTag } from 'next/cache';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'customer-care-center';
const CACHE_TAG_PREFIX = 'cms-content';

function revalidatePages() {
  revalidatePath('/customer-care-center');
  revalidatePath('/ar/customer-care-center');
  revalidateTag(`${CACHE_TAG_PREFIX}-customer-care-center-ltr`);
  revalidateTag(`${CACHE_TAG_PREFIX}-customer-care-center-rtl`);
}

export async function GET(request: NextRequest) {
  try {
    const language = request.nextUrl.searchParams.get('language') || 'ltr';
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const content = (await collection.findOne({ language })) as CustomerCareContent | null;

    if (!content) {
      return NextResponse.json(
        { success: false, message: 'No content found for this language' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Error fetching Customer Care content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch Customer Care content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CustomerCareContent = await request.json();
    if (!body.language) {
      return NextResponse.json(
        { success: false, message: 'Language is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const existing = await collection.findOne({ language: body.language });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: `Content already exists for language: ${body.language}. Use PUT to update.`,
        },
        { status: 409 }
      );
    }

    const { _id, ...bodyWithoutId } = body;
    const result = await collection.insertOne({
      ...bodyWithoutId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePages();

    return NextResponse.json({
      success: true,
      message: 'Customer Care content created',
      data: { _id: result.insertedId },
    });
  } catch (error) {
    console.error('Error creating Customer Care content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create Customer Care content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: CustomerCareContent = await request.json();
    if (!body.language) {
      return NextResponse.json(
        { success: false, message: 'Language is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const { _id, ...bodyWithoutId } = body;

    const result = await collection.updateOne(
      { language: body.language },
      {
        $set: {
          ...bodyWithoutId,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    revalidatePages();

    return NextResponse.json({
      success: true,
      message: 'Customer Care content updated',
      data: { matched: result.matchedCount, modified: result.modifiedCount },
    });
  } catch (error) {
    console.error('Error updating Customer Care content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update Customer Care content' },
      { status: 500 }
    );
  }
}
