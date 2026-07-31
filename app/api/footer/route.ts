import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { FooterContent } from '@/types/footer';
import { revalidatePath } from 'next/cache';
import { cleanupUnusedImages } from '@/lib/image-utils';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'footer';

function sanitizeContactItems(items: unknown[] = []) {
  return items.map((item: any, index: number) => ({
    _id: item?._id,
    label: item?.label || '',
    value: item?.value || '',
    order: typeof item?.order === 'number' ? item.order : index,
    isActive: item?.isActive !== false,
  }));
}

function sanitizeFooterContent(body: FooterContent): FooterContent {
  return {
    ...body,
    serviceAssistance: {
      ...body.serviceAssistance,
      items: sanitizeContactItems((body.serviceAssistance?.items as unknown[]) || []),
    },
    contactSection: {
      ...body.contactSection,
      items: sanitizeContactItems((body.contactSection?.items as unknown[]) || []),
    },
  };
}

// GET - Fetch Footer content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'ltr';

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const content = await collection.findOne({ language }) as FooterContent | null;

    if (!content) {
      return NextResponse.json({
        success: false,
        message: 'No content found for this language',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: sanitizeFooterContent(content),
    });
  } catch (error) {
    console.error('Error fetching Footer content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch Footer content',
    }, { status: 500 });
  }
}

// POST - Create new Footer content
export async function POST(request: NextRequest) {
  try {
    const body: FooterContent = await request.json();
    const sanitizedBody = sanitizeFooterContent(body);

    if (!sanitizedBody.language) {
      return NextResponse.json({
        success: false,
        message: 'Language is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Check if content already exists for this language
    const existing = await collection.findOne({ language: sanitizedBody.language });
    if (existing) {
      return NextResponse.json({
        success: false,
        message: `Content already exists for language: ${sanitizedBody.language}. Use PUT to update.`,
      }, { status: 409 });
    }

    const now = new Date();
    // Exclude _id so MongoDB can generate a proper ObjectId
    const { _id, ...bodyWithoutId } = sanitizedBody;
    const newContent = {
      ...bodyWithoutId,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(newContent);

    // Revalidate homepage (footer affects all pages)
    revalidatePath('/', 'layout');

    return NextResponse.json({
      success: true,
      message: 'Footer content created successfully',
      data: { ...newContent, _id: result.insertedId },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating Footer content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create Footer content',
    }, { status: 500 });
  }
}

// PUT - Update existing Footer content
export async function PUT(request: NextRequest) {
  try {
    const body: FooterContent = await request.json();
    const sanitizedBody = sanitizeFooterContent(body);

    if (!sanitizedBody.language) {
      return NextResponse.json({
        success: false,
        message: 'Language is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const oldDocument = await collection.findOne({ language: sanitizedBody.language });

    const { _id, createdAt, ...updateData } = sanitizedBody;
    const updatedContent = {
      ...updateData,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { language: sanitizedBody.language },
      { $set: updatedContent },
      { returnDocument: 'after', upsert: true }
    );

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Failed to update Footer content',
      }, { status: 500 });
    }

    if (oldDocument) {
      await cleanupUnusedImages(oldDocument, updatedContent);
    }

    // Revalidate homepage (footer affects all pages)
    revalidatePath('/', 'layout');

    return NextResponse.json({
      success: true,
      message: 'Footer content updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating Footer content:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update Footer content',
    }, { status: 500 });
  }
}
