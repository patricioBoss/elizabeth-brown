import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/dbConnect';
import Investment from '@/models/investment.model';
import Transaction from '@/models/transaction.model';
import User from '@/models/user.model';

// POST - Add daily ROI to an investment
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string; investmentId: string } }
) {
  try {
    await dbConnect();

    const { daily } = await request.json();
    const { userId, investmentId } = params;

    const profile = await User.findById(userId).lean();
    if (!profile) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    const currentBalance = (profile as any).accountBalance;

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      await (Transaction as any).create(
        [
          {
            userId,
            investmentId,
            amount: Number(daily),
            type: 'daily',
            currentBalance: Number(currentBalance) + Number(daily),
          },
        ],
        { session }
      );

      await Investment.findByIdAndUpdate(
        investmentId,
        { $inc: { daysCount: 1 } },
        { session }
      );

      await User.findByIdAndUpdate(
        userId,
        { $inc: { accountBalance: Number(daily) } },
        { session, new: true, runValidators: true }
      );
    });

    session.endSession();

    return NextResponse.json(
      { message: 'daily rio is added' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Daily ROI error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
