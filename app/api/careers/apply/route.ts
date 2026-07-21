import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "albaharpartners1";
const COLLECTION_NAME = "career_applications";

interface CareerApplicationPayload {
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  country?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  coverLetter?: string;
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const [items, total] = await Promise.all([
      collection.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error("Error fetching career applications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch job inquiries" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CareerApplicationPayload;
    const {
      jobTitle,
      fullName,
      email,
      phone,
      country,
      linkedInUrl,
      portfolioUrl,
      resumeUrl,
      coverLetter,
    } = body || ({} as any);

    if (!jobTitle || !fullName || !email || !phone || !resumeUrl) {
      return NextResponse.json(
        { success: false, message: "Job title, full name, email, phone and resume are required" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const now = new Date();
    const application = {
      jobTitle: String(jobTitle).trim(),
      fullName: String(fullName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      country: country ? String(country).trim() : "",
      linkedInUrl: linkedInUrl ? String(linkedInUrl).trim() : "",
      portfolioUrl: portfolioUrl ? String(portfolioUrl).trim() : "",
      resumeUrl: String(resumeUrl).trim(),
      coverLetter: coverLetter ? String(coverLetter).trim() : "",
      createdAt: now,
    };

    const result = await collection.insertOne(application as any);

    // Best-effort: forward to existing external mail service (same one used by enquiries)
    try {
      await fetch("https://express-brevomail.vercel.app/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "career_application", ...application }),
      });
    } catch (forwardError) {
      console.error("Failed to forward career application:", forwardError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        data: { ...application, _id: result.insertedId },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting career application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit application" },
      { status: 500 },
    );
  }
}

