import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SolutionItem } from '@/types/solutions';
import { revalidatePath } from 'next/cache';
import { cleanupUnusedImages, deleteImageFiles, extractImagePaths } from '@/lib/image-utils';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'solutions';

const normalizeSolution = (solution: SolutionItem): SolutionItem => ({
  ...solution,
  tabTitleAr: solution.tabTitleAr || solution.tabTitle,
  titleAr: solution.titleAr || solution.title,
  descriptionAr: solution.descriptionAr || solution.description,
  detailDescriptionAr: solution.detailDescriptionAr || solution.detailDescription,
  benefitsAr: solution.benefitsAr?.length ? solution.benefitsAr : solution.benefits,
});

// POST - Add a new solution to the solutions array
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await params;
    const body = await request.json();
    const { solution } = body;

    if (operation !== 'add') {
      return NextResponse.json({
        success: false,
        message: 'Invalid operation',
      }, { status: 400 });
    }

    if (!solution) {
      return NextResponse.json({
        success: false,
        message: 'Solution data is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Add solution to the beginning of the array
    const result = await collection.findOneAndUpdate(
      { language: 'ltr' },
      {
        $push: {
          solutions: {
            $each: [normalizeSolution(solution)],
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
        message: 'Solutions content not found. Please create it first.',
      }, { status: 404 });
    }

    revalidatePath('/solutions');
    revalidatePath('/');
    revalidatePath('/services-details-1');

    return NextResponse.json({
      success: true,
      message: 'Solution added successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error adding solution:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to add solution',
    }, { status: 500 });
  }
}

// PUT - Update a specific solution in the solutions array
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await params;
    const body = await request.json();
    const { solutionIndex, solution } = body;

    if (operation !== 'update') {
      return NextResponse.json({
        success: false,
        message: 'Invalid operation',
      }, { status: 400 });
    }

    if (solutionIndex === undefined || !solution) {
      return NextResponse.json({
        success: false,
        message: 'Solution index and solution data are required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const oldDocument = await collection.findOne({ language: 'ltr' });
    const oldSolution = oldDocument?.solutions?.[solutionIndex];

    // Update the specific solution at the given index
    const result = await collection.findOneAndUpdate(
      { language: 'ltr' },
      {
        $set: {
          [`solutions.${solutionIndex}`]: normalizeSolution(solution),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Solutions content not found',
      }, { status: 404 });
    }

    if (oldSolution) {
      await cleanupUnusedImages(oldSolution, solution);
    }

    revalidatePath('/solutions');
    revalidatePath('/');
    revalidatePath('/services-details-1');

    return NextResponse.json({
      success: true,
      message: 'Solution updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating solution:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update solution',
    }, { status: 500 });
  }
}

// DELETE - Remove a specific solution from the solutions array
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await params;
    const searchParams = request.nextUrl.searchParams;
    const solutionIndex = searchParams.get('index');

    if (operation !== 'delete') {
      return NextResponse.json({
        success: false,
        message: 'Invalid operation',
      }, { status: 400 });
    }

    if (solutionIndex === null) {
      return NextResponse.json({
        success: false,
        message: 'Solution index is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const index = parseInt(solutionIndex, 10);
    if (isNaN(index)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid solution index',
      }, { status: 400 });
    }

    // Get the solution to delete (to verify it exists)
    const content = await collection.findOne({ language: 'ltr' });
    if (!content) {
      return NextResponse.json({
        success: false,
        message: 'Solutions content not found',
      }, { status: 404 });
    }

    const solutionsArray = content.solutions || [];
    if (index < 0 || index >= solutionsArray.length) {
      return NextResponse.json({
        success: false,
        message: 'Invalid solution index',
      }, { status: 400 });
    }

    // Remove the solution at the specific index using $pull
    const solutionToDelete = solutionsArray[index];
    const result = await collection.findOneAndUpdate(
      { language: 'ltr' },
      {
        $pull: {
          solutions: solutionToDelete,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    const imagePaths = extractImagePaths(solutionToDelete);
    if (imagePaths.size > 0) {
      await deleteImageFiles(Array.from(imagePaths));
    }

    revalidatePath('/solutions');
    revalidatePath('/');
    revalidatePath('/services-details-1');

    return NextResponse.json({
      success: true,
      message: 'Solution deleted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error deleting solution:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete solution',
    }, { status: 500 });
  }
}
