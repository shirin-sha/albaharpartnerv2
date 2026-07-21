import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// Debug endpoint to see what's in the database
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection('homepage');
    
    // Get all documents
    const allDocs = await collection.find({}).toArray();
    
    // Serialize for JSON
    const serialized = allDocs.map(doc => ({
      ...doc,
      _id: doc._id?.toString(),
    }));
    
    return NextResponse.json({
      success: true,
      count: serialized.length,
      documents: serialized,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
