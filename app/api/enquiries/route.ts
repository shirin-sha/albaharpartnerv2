import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'enquiries';

interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  comment: string;
}

// GET - List enquiries (simple pagination)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const [items, total] = await Promise.all([
      collection
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch enquiries',
      },
      { status: 500 },
    );
  }
}

// POST - Store a new enquiry (and forward to existing email service)
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EnquiryPayload;

    const { name, email, phone, country, subject, comment } = body;
    if (!name || !email || !phone || !country || !subject || !comment) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required',
        },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const now = new Date();
    const newEnquiry = {
      name,
      email,
      phone,
      country,
      subject,
      comment,
      createdAt: now,
    };

    const result = await collection.insertOne(newEnquiry as any);

    // Best-effort: forward to existing external service (keeps current email behaviour)
    try {
      await fetch('https://express-brevomail.vercel.app/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, country, subject, comment }),
      });
    } catch (forwardError) {
      console.error('Failed to forward enquiry to external service:', forwardError);
      // Do not fail the request for admins if email forwarding fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Enquiry submitted successfully',
        data: { ...newEnquiry, _id: result.insertedId },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error saving enquiry:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit enquiry',
      },
      { status: 500 },
    );
  }
}

