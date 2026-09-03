import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { CustomerStory } from '@/types/customer-stories';
import { revalidatePath } from 'next/cache';
import { deleteReferencedUploads } from '@/lib/image-utils';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'customerstories';

const normalizeStory = (story: CustomerStory): CustomerStory => ({
  ...story,
  titleAr: story.titleAr || story.title,
  descriptionAr: story.descriptionAr || story.description,
});

// POST - Add a new story to the stories array
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await params;
    const body = await request.json();
    const { story } = body;

    if (operation !== 'add') {
      return NextResponse.json({
        success: false,
        message: 'Invalid operation',
      }, { status: 400 });
    }

    if (!story) {
      return NextResponse.json({
        success: false,
        message: 'Story data is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Add story to the beginning of the array
    const result = await collection.findOneAndUpdate(
      { language: 'ltr' },
      {
        $push: {
          stories: {
            $each: [normalizeStory(story)],
            $position: 0,
          } as any,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after', upsert: false }
    );

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Customer Stories content not found. Please create it first.',
      }, { status: 404 });
    }

    revalidatePath('/customer-stories');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Story added successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error adding story:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to add story',
    }, { status: 500 });
  }
}

// PUT - Update a specific story in the stories array
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await params;
    const body = await request.json();
    const { storyIndex, story } = body;

    if (operation !== 'update') {
      return NextResponse.json({
        success: false,
        message: 'Invalid operation',
      }, { status: 400 });
    }

    if (storyIndex === undefined || !story) {
      return NextResponse.json({
        success: false,
        message: 'Story index and story data are required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Update the specific story at the given index
    const result = await collection.findOneAndUpdate(
      { language: 'ltr' },
      {
        $set: {
          [`stories.${storyIndex}`]: normalizeStory(story),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Customer Stories content not found',
      }, { status: 404 });
    }

    revalidatePath('/customer-stories');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Story updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update story',
    }, { status: 500 });
  }
}

// DELETE - Remove a specific story from the stories array
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await params;
    const searchParams = request.nextUrl.searchParams;
    const storyIndex = searchParams.get('index');

    if (operation !== 'delete') {
      return NextResponse.json({
        success: false,
        message: 'Invalid operation',
      }, { status: 400 });
    }

    if (storyIndex === null) {
      return NextResponse.json({
        success: false,
        message: 'Story index is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const index = parseInt(storyIndex, 10);
    if (isNaN(index)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid story index',
      }, { status: 400 });
    }

    // Get the story to delete (to verify it exists)
    const content = await collection.findOne({ language: 'ltr' });
    if (!content) {
      return NextResponse.json({
        success: false,
        message: 'Customer Stories content not found',
      }, { status: 404 });
    }

    const storiesArray = content.stories || [];
    if (index < 0 || index >= storiesArray.length) {
      return NextResponse.json({
        success: false,
        message: 'Invalid story index',
      }, { status: 400 });
    }

    // Remove the story at the specific index using $pull
    const storyToDelete = storiesArray[index];
    const result = await collection.findOneAndUpdate(
      { language: 'ltr' },
      {
        $pull: {
          stories: storyToDelete,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    revalidatePath('/customer-stories');
    revalidatePath('/');
    await deleteReferencedUploads(storyToDelete);

    return NextResponse.json({
      success: true,
      message: 'Story deleted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete story',
    }, { status: 500 });
  }
}
