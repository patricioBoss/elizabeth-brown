import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/dbConnect';
import Investment from '@/models/investment.model';
import Transaction from '@/models/transaction.model';
import User from '@/models/user.model';
import plans from '@/helpers/plans';

// GET - Process daily ROI for all active investments (cron job endpoint)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    const session = await mongoose.startSession();

    // Investments still running (days < 14)
    const continousInvts = await Investment.find({
      daysCount: { $lt: 14 },
      status: 'active',
    }).populate({ path: 'userId', select: 'accountBalance _id' });

    // Investments on their final day (day 14)
    const endingInvts = await Investment.find({
      daysCount: 14,
      status: 'active',
    }).populate({ path: 'userId', select: 'accountBalance _id' });

    // Final day transactions (interest payment)
    const endingTxns = endingInvts?.map(
      ({ _id, userId, planId, capital }: any) => ({
        userId: userId._id,
        investmentId: _id,
        amount: Number((plans[planId].interest / 100) * capital),
        type: 'daily',
        currentBalance:
          Number(userId.accountBalance) +
          Number((plans[planId].interest / 100) * capital),
      })
    );

    // Balance-out transactions (return capital)
    const endingInvtsTxns = endingInvts?.map(
      ({ _id, userId, planId, capital }: any) => ({
        userId: userId._id,
        investmentId: _id,
        amount: -Number(capital),
        type: 'investment',
        currentBalance:
          Number(userId.accountBalance) +
          Number((plans[planId].interest / 100) * capital) +
          Number(capital),
      })
    );

    // Bulk updates for ending users
    const endingUser = endingInvts?.map(({ userId, planId, capital }: any) => ({
      updateOne: {
        filter: { _id: userId._id },
        update: {
          $inc: {
            accountBalance:
              Number((plans[planId].interest / 100) * capital) + Number(capital),
          },
        },
      },
    }));

    // Transactions for continuing users
    const continousTxns = continousInvts.map(
      ({ _id, userId, planId, capital }: any) => ({
        userId: userId._id,
        investmentId: _id,
        amount: Number((plans[planId].interest / 100) * capital),
        type: 'daily',
        currentBalance:
          Number(userId.accountBalance) +
          Number((plans[planId].interest / 100) * capital),
      })
    );

    // Bulk updates for continuing users
    const continousUser = continousTxns.map(({ userId, amount }: any) => ({
      updateOne: {
        filter: { _id: userId },
        update: { $inc: { accountBalance: Number(amount) } },
      },
    }));

    await session.withTransaction(async () => {
      await (Transaction as any).create(
        [
          ...continousTxns,
          ...(endingTxns ?? []),
          ...(endingInvtsTxns ?? []),
        ],
        { session, ordered: true }
      );

      await Investment.updateMany(
        { daysCount: 14, status: 'active' },
        { $inc: { daysCount: 1 }, status: 'ended' },
        { session }
      );

      await Investment.updateMany(
        { daysCount: { $lt: 14 }, status: 'active' },
        { $inc: { daysCount: 1 } },
        { session }
      );

      await User.bulkWrite(
        [...continousUser, ...(endingUser ?? [])],
        { session }
      );
    });

    session.endSession();

    return NextResponse.json(
      { message: 'daily investment update successful' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Automate investment error:', error);
    return NextResponse.json(
      { message: 'server error', error: error.message },
      { status: 500 }
    );
  }
}
