import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No resume file provided" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only PDF, DOC, DOCX are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 10MB limit" },
        { status: 400 },
      );
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = path.extname(sanitizedName);
    const baseName = path.basename(sanitizedName, ext);
    const fileName = `${baseName}_${timestamp}${ext}`;

    const uploadPath = path.join(process.cwd(), "public", "uploads", "resumes");
    const filePath = path.join(uploadPath, fileName);

    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: "Resume uploaded successfully",
      path: `/uploads/resumes/${fileName}`,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload resume" },
      { status: 500 },
    );
  }
}

