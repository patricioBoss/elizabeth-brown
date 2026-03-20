import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Investment from '@/models/investment.model';

// GET - Get all investments for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const investments = await Investment.find({ userId: params.userId }).exec();

    return NextResponse.json(
      { message: 'success', data: investments },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new investment for a user
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();

    const investment = new Investment({
      userId: params.userId,
      status: 'pending',
      ...body,
    });

    const result = await investment.save();

    return NextResponse.json(
      { message: 'success', data: result },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
