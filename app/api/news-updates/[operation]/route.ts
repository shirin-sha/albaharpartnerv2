import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { NewsPost } from '@/types/news-updates';
import { revalidatePath } from 'next/cache';
import { cleanupUnusedImages, deleteImageFiles, extractImagePaths } from '@/lib/image-utils';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'newsupdates';

const normalizePost = (post: NewsPost): NewsPost => ({
  ...post,
  titleAr: post.titleAr || post.title,
  categoryAr: post.categoryAr || post.category,
  shortDescriptionAr: post.shortDescriptionAr || post.shortDescription || '',
  longDescriptionAr: post.longDescriptionAr || post.longDescription || '',
  isFeatured: post.isFeatured === true,
});

// POST - Add a new post to the posts array
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await params;
    const body = await request.json();
    const { post } = body;

    if (operation !== 'add') {
      return NextResponse.json({
        success: false,
        message: 'Invalid operation',
      }, { status: 400 });
    }

    if (!post) {
      return NextResponse.json({
        success: false,
        message: 'Post data is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const normalizedPost = normalizePost(post);
    const isFeaturedPost = normalizedPost.isFeatured === true;

    if (isFeaturedPost) {
      await collection.updateOne(
        { language: 'ltr' },
        {
          $set: {
            'posts.$[].isFeatured': false,
          } as any,
        }
      );
    }

    // Add post to the beginning of the array
    const result = await collection.findOneAndUpdate(
      { language: 'ltr' },
      {
        $push: {
          posts: {
            $each: [normalizedPost],
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
        message: 'News & Updates content not found. Please create it first.',
      }, { status: 404 });
    }

    revalidatePath('/news-updates');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Post added successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error adding post:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to add post',
    }, { status: 500 });
  }
}

// PUT - Update a specific post in the posts array
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await params;
    const body = await request.json();
    const { postIndex, post } = body;

    if (operation !== 'update') {
      return NextResponse.json({
        success: false,
        message: 'Invalid operation',
      }, { status: 400 });
    }

    if (postIndex === undefined || !post) {
      return NextResponse.json({
        success: false,
        message: 'Post index and post data are required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const oldDocument = await collection.findOne({ language: 'ltr' });
    const oldPost = oldDocument?.posts?.[postIndex];

    const normalizedPost = normalizePost(post);
    const isFeaturedPost = normalizedPost.isFeatured === true;

    if (isFeaturedPost) {
      await collection.updateOne(
        { language: 'ltr' },
        {
          $set: {
            'posts.$[].isFeatured': false,
          } as any,
        }
      );
    }

    // Update the specific post at the given index
    const result = await collection.findOneAndUpdate(
      { language: 'ltr' },
      {
        $set: {
          [`posts.${postIndex}`]: normalizedPost,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'News & Updates content not found',
      }, { status: 404 });
    }

    if (oldPost) {
      await cleanupUnusedImages(oldPost, normalizedPost);
    }

    revalidatePath('/news-updates');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update post',
    }, { status: 500 });
  }
}

// DELETE - Remove a specific post from the posts array
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await params;
    const searchParams = request.nextUrl.searchParams;
    const postIndex = searchParams.get('index');

    if (operation !== 'delete') {
      return NextResponse.json({
        success: false,
        message: 'Invalid operation',
      }, { status: 400 });
    }

    if (postIndex === null) {
      return NextResponse.json({
        success: false,
        message: 'Post index is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const index = parseInt(postIndex, 10);
    if (isNaN(index)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid post index',
      }, { status: 400 });
    }

    // Get the post to delete (to verify it exists)
    const content = await collection.findOne({ language: 'ltr' });
    if (!content) {
      return NextResponse.json({
        success: false,
        message: 'News & Updates content not found',
      }, { status: 404 });
    }

    const postsArray = content.posts || [];
    if (index < 0 || index >= postsArray.length) {
      return NextResponse.json({
        success: false,
        message: 'Invalid post index',
      }, { status: 400 });
    }

    // Remove the post at the specific index using $pull
    const postToDelete = postsArray[index];
    const result = await collection.findOneAndUpdate(
      { language: 'ltr' },
      {
        $pull: {
          posts: postToDelete,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    const imagePaths = extractImagePaths(postToDelete);
    if (imagePaths.size > 0) {
      await deleteImageFiles(Array.from(imagePaths));
    }

    revalidatePath('/news-updates');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete post',
    }, { status: 500 });
  }
}
