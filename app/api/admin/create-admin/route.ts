import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

/**
 * This is a utility endpoint to create the first admin user
 * In production, remove this or protect it with a secret key
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Add a secret key check for security
    const secretKey = request.headers.get('x-secret-key');
    if (secretKey !== process.env.ADMIN_CREATE_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const adminCollection = db.collection('admins');

    // Check if admin already exists
    const existingAdmin = await adminCollection.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const result = await adminCollection.insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || email.split('@')[0],
      role: 'admin',
      createdAt: new Date(),
      lastLogin: null,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Admin created successfully',
        adminId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
