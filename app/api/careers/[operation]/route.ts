import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Job } from '@/types/careers';
import { revalidatePath } from 'next/cache';

const DB_NAME = 'albaharpartners1';
const COLLECTION_NAME = 'careers';

const normalizeJob = (job: Job): Job => ({
  ...job,
  titleAr: job.titleAr || job.title,
  descriptionAr: job.descriptionAr || job.description,
  responsibilitiesAr: job.responsibilitiesAr?.length ? job.responsibilitiesAr : job.responsibilities,
});

// POST - Add a new job to the jobs array
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await params;
    const body = await request.json();
    const { job } = body;

    if (operation !== 'add') {
      return NextResponse.json({
        success: false,
        message: 'Invalid operation',
      }, { status: 400 });
    }

    if (!job) {
      return NextResponse.json({
        success: false,
        message: 'Job data is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Add job to the beginning of the array
    const result = await collection.findOneAndUpdate(
      { language: 'ltr' },
      {
        $push: {
          jobs: {
            $each: [normalizeJob(job)],
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
        message: 'Careers content not found. Please create it first.',
      }, { status: 404 });
    }

    revalidatePath('/career');

    return NextResponse.json({
      success: true,
      message: 'Job added successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error adding job:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to add job',
    }, { status: 500 });
  }
}

// PUT - Update a specific job in the jobs array
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await params;
    const body = await request.json();
    const { jobIndex, job } = body;

    if (operation !== 'update') {
      return NextResponse.json({
        success: false,
        message: 'Invalid operation',
      }, { status: 400 });
    }

    if (jobIndex === undefined || !job) {
      return NextResponse.json({
        success: false,
        message: 'Job index and job data are required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Update the specific job at the given index
    const result = await collection.findOneAndUpdate(
      { language: 'ltr' },
      {
        $set: {
          [`jobs.${jobIndex}`]: normalizeJob(job),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Careers content not found',
      }, { status: 404 });
    }

    revalidatePath('/career');

    return NextResponse.json({
      success: true,
      message: 'Job updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update job',
    }, { status: 500 });
  }
}

// DELETE - Remove a specific job from the jobs array
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ operation: string }> }
) {
  try {
    const { operation } = await params;
    const searchParams = request.nextUrl.searchParams;
    const jobIndex = searchParams.get('index');

    if (operation !== 'delete') {
      return NextResponse.json({
        success: false,
        message: 'Invalid operation',
      }, { status: 400 });
    }

    if (jobIndex === null) {
      return NextResponse.json({
        success: false,
        message: 'Job index is required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const index = parseInt(jobIndex, 10);
    if (isNaN(index)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid job index',
      }, { status: 400 });
    }

    // Get the job to delete (to verify it exists)
    const content = await collection.findOne({ language: 'ltr' });
    if (!content) {
      return NextResponse.json({
        success: false,
        message: 'Careers content not found',
      }, { status: 404 });
    }

    const jobsArray = content.jobs || [];
    if (index < 0 || index >= jobsArray.length) {
      return NextResponse.json({
        success: false,
        message: 'Invalid job index',
      }, { status: 400 });
    }

    // Remove the job at the specific index using $pull
    const jobToDelete = jobsArray[index];
    const result = await collection.findOneAndUpdate(
      { language: 'ltr' },
      {
        $pull: {
          jobs: jobToDelete,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    revalidatePath('/career');

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete job',
    }, { status: 500 });
  }
}
