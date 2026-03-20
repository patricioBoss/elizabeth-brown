import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Investment from '@/models/investment.model';

// GET - Get all investments (admin route)
export async function GET(
  _request: NextRequest,
  _context: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const investments = await Investment.find({}).exec();

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
