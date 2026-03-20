import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/dbConnect';
import Withdrawal from '@/models/withdrawal.model';
import Transaction from '@/models/transaction.model';
import User from '@/models/user.model';

// GET - Get withdrawal by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string; withdrawId: string } }
) {
  try {
    await dbConnect();

    const withdrawal = await Withdrawal.findById(params.withdrawId);

    if (!withdrawal) {
      return NextResponse.json({ message: 'not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'success', data: withdrawal },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Approve or update withdrawal (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string; withdrawId: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const { action } = body;

    const withdrawal = await Withdrawal.findById(params.withdrawId);
    if (!withdrawal) {
      return NextResponse.json({ message: 'not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Approve withdrawal
      await Withdrawal.findByIdAndUpdate(
        params.withdrawId,
        { status: 'paid', approvedDate: Date.now() },
        { new: true, runValidators: true }
      );

      return NextResponse.json({ message: 'approved' }, { status: 200 });
    } else if (action === 'cancel') {
      // Cancel withdrawal and refund balance
      const session = await mongoose.startSession();

      await session.withTransaction(async () => {
        await Transaction.deleteOne(
          { _id: withdrawal.transactionId },
          { session }
        );

        await Withdrawal.findByIdAndUpdate(
          params.withdrawId,
          { status: 'cancelled' },
          { session, new: true }
        );

        await User.findByIdAndUpdate(
          withdrawal.userId,
          { $inc: { accountBalance: Number(withdrawal.amount) } },
          { session, new: true, runValidators: true }
        );
      });

      session.endSession();

      return NextResponse.json(
        { message: 'withdrawal cancelled' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Update withdrawal error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete withdrawal
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { userId: string; withdrawId: string } }
) {
  try {
    await dbConnect();

    await Withdrawal.deleteOne({ _id: params.withdrawId });

    return NextResponse.json(
      { message: 'withdrawal deleted' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
