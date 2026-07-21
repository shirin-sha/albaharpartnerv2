import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { HomepageContent } from '@/types/homepage';

// GET - Fetch all homepage content (for admin)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection<HomepageContent>('homepage');
    
    // Fetch all homepage content, sorted by language and updatedAt
    const contents = await collection
      .find({})
      .sort({ language: 1, updatedAt: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: contents,
    });
  } catch (error) {
    console.error('Error fetching all homepage content:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch homepage content',
      },
      { status: 500 }
    );
  }
}
