import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user.model';
import Transaction from '@/models/transaction.model';

// POST - Redeem bonus
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const { bonus } = await request.json();
    const userId = params.userId;

    const profile = await User.findById(userId).lean();
    if (!profile) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    const currentBalance = (profile as any).accountBalance;
    const currentBonus = (profile as any).bonus;

    if (bonus !== currentBonus) {
      return NextResponse.json({ message: 'bonus not present' }, { status: 404 });
    }

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      await Transaction.create(
        [
          {
            userId,
            amount: Number(bonus),
            type: 'bonus',
            currentBalance: Number(currentBalance) + Number(bonus),
          },
        ],
        { session, new: true }
      );

      await User.findByIdAndUpdate(
        userId,
        { $inc: { accountBalance: Number(bonus), bonus: -Number(bonus) } },
        { session, new: true, runValidators: true }
      );
    });

    session.endSession();

    return NextResponse.json({ message: 'bonus redeemed successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Redeem bonus error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Add bonus (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const { bonus } = await request.json();
    const userId = params.userId;

    await User.findByIdAndUpdate(
      userId,
      { $inc: { bonus: Number(bonus) } },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ message: 'bonus added successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Add bonus error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
