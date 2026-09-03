import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { HomepageContent } from '@/types/homepage';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { deleteUnusedManagedUploads, deleteReferencedUploads } from '@/lib/image-utils';

// GET - Fetch homepage content
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'ltr';
    
    const db = await getDatabase();
    const collection = db.collection<HomepageContent>('homepage');
    
    // Find active homepage content for the specified language
    const content = await collection.findOne({
      language: language as 'ltr' | 'rtl',
      isActive: true,
    });
    
    if (!content) {
      // Return default content if none exists
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No content found. Please create content in admin panel.',
      });
    }
    
    // Convert MongoDB ObjectId to string for JSON serialization
    const serializedContent = {
      ...content,
      _id: content._id?.toString(),
    };
    
    return NextResponse.json({
      success: true,
      data: serializedContent,
    });
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch homepage content',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Create new homepage content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const db = await getDatabase();
    const collection = db.collection<HomepageContent>('homepage');
    
    // Deactivate other content for the same language if this is active
    if (body.isActive) {
      await collection.updateMany(
        { language: body.language },
        { $set: { isActive: false } }
      );
    }
    
    const { blogsSection: _unusedBlogsSection, ...bodyWithoutBlogs } = body;

    const newContent: HomepageContent = {
      ...bodyWithoutBlogs,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await collection.insertOne(newContent as any);
    
    // Revalidate homepage after creating content
    revalidatePath('/');
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newContent },
      message: 'Homepage content created successfully',
    });
  } catch (error) {
    console.error('Error creating homepage content:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create homepage content',
      },
      { status: 500 }
    );
  }
}

// PUT - Update homepage content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, blogsSection: _unusedBlogsSection, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Content ID is required',
        },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const collection = db.collection<HomepageContent>('homepage');
    
    // Convert string _id to ObjectId
    const objectId = new ObjectId(_id);
    
    // Get old document to find images that need to be deleted
    const oldDocument = await collection.findOne({ _id: objectId as any });
    
    // Deactivate other content for the same language if this is active
    if (updateData.isActive) {
      await collection.updateMany(
        { 
          language: updateData.language,
          _id: { $ne: objectId as any }
        },
        { $set: { isActive: false } }
      );
    }
    
    const result = await collection.updateOne(
      { _id: objectId as any },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
        $unset: {
          blogsSection: '',
        },
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Content not found',
        },
        { status: 404 }
      );
    }
    
    const siblings = await collection.find({ _id: { $ne: objectId as any } }).toArray();
    await deleteUnusedManagedUploads(oldDocument, updateData, siblings);
    
    // Revalidate homepage after updating content
    revalidatePath('/');
    
    return NextResponse.json({
      success: true,
      message: 'Homepage content updated successfully',
    });
  } catch (error) {
    console.error('Error updating homepage content:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update homepage content',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete homepage content
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Content ID is required',
        },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const collection = db.collection<HomepageContent>('homepage');
    
    // Convert string id to ObjectId
    const objectId = new ObjectId(id);
    
    // Get document before deleting to clean up images
    const documentToDelete = await collection.findOne({ _id: objectId as any });
    
    const result = await collection.deleteOne({ _id: objectId as any });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Content not found',
        },
        { status: 404 }
      );
    }
    
    if (documentToDelete) {
      await deleteReferencedUploads(documentToDelete);
    }
    
    // Revalidate homepage after deleting content
    revalidatePath('/');
    
    return NextResponse.json({
      success: true,
      message: 'Homepage content deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting homepage content:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete homepage content',
      },
      { status: 500 }
    );
  }
}
