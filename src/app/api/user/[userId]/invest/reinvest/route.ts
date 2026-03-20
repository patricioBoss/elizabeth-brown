import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/dbConnect';
import Investment from '@/models/investment.model';
import Transaction from '@/models/transaction.model';
import User from '@/models/user.model';
import uuidv4 from '@/utils/uuidv4';
import getNextPlanId from '@/utils/getNextPlanId';
import { add } from 'date-fns';

// POST - Reinvest account balance into a new investment
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const userId = params.userId;

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const investment = await Investment.create(
        [
          {
            ...body,
            userId,
            planId: getNextPlanId(body.capital).id - 1,
            stock: 'BTC-USD',
            currency: 'btc',
            transactionId: 'REI-' + uuidv4(),
            approvedDate: Date.now(),
            status: 'active',
            withDrawalDate: add(new Date(), { days: 5 }).toISOString(),
          },
        ],
        { session }
      );

      await User.findByIdAndUpdate(
        userId,
        { accountBalance: 0 },
        { session, new: true, runValidators: true }
      );

      await (Transaction as any).create(
        [
          {
            amount: body.capital,
            investmentId: investment[0]._id,
            currentBalance: 0,
            type: 'investment',
            userId,
          },
        ],
        { session }
      );
    });

    session.endSession();

    return NextResponse.json(
      { message: 'reinvest successful' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Reinvest error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
