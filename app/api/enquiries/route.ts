import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyCaptcha } from '@/lib/captcha';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'enquiries';

interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  country?: string;
  subject: string;
  comment: string;
  captchaToken?: string;
  captchaAnswer?: string;
  website?: string; // honeypot
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

    // Honeypot: bots fill hidden fields — pretend success
    if (body.website) {
      return NextResponse.json(
        { success: true, message: 'Enquiry submitted successfully' },
        { status: 201 },
      );
    }

    const { name, email, phone, subject, comment, captchaToken, captchaAnswer } = body;
    const country = (body.country || 'Kuwait').trim();

    if (!name || !email || !phone || !subject || !comment) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required',
        },
        { status: 400 },
      );
    }

    if (!captchaToken || !captchaAnswer || !verifyCaptcha(captchaToken, captchaAnswer)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid captcha. Please try again.',
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

    // Forward email in background — don't block the user response
    const forwardPayload = JSON.stringify({ name, email, phone, country, subject, comment });
    void (async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        await fetch('https://express-brevomail.vercel.app/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: forwardPayload,
          signal: controller.signal,
        });
        clearTimeout(timeout);
      } catch (forwardError) {
        console.error('Failed to forward enquiry to external service:', forwardError);
      }
    })();

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
