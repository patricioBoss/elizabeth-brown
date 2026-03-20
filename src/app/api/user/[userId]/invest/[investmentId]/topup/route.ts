import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/dbConnect';
import Investment from '@/models/investment.model';
import Transaction from '@/models/transaction.model';
import User from '@/models/user.model';
import sendMail from '@/helpers/sendMail';
import sampleMailTemplate from '@/helpers/sampleMailTemplate';
import plans from '@/helpers/plans';
import { fCurrency } from '@/utils/formatNumber';
import uuidv4 from '@/utils/uuidv4';
import getNextPlanId from '@/utils/getNextPlanId';
import { add } from 'date-fns';

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:8084';

// POST - Top up an investment with account balance
export async function POST(
  _request: NextRequest,
  { params }: { params: { userId: string; investmentId: string } }
) {
  try {
    await dbConnect();

    const { userId, investmentId } = params;

    const profile = await User.findById(userId).lean();
    if (!profile) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    const investment = await Investment.findById(investmentId).lean();
    if (!investment) {
      return NextResponse.json({ message: 'investment not found' }, { status: 404 });
    }

    const accountBalance = (profile as any).accountBalance;
    const amount = investment.capital;
    const newCapital = Number(accountBalance) + Number(amount);

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const updated = await Investment.findByIdAndUpdate(
        investmentId,
        {
          planId: getNextPlanId(newCapital).id - 1,
          transactionId: 'TOP-' + uuidv4(),
          capital: newCapital,
          approvedDate: Date.now(),
          status: 'active',
          withDrawalDate: add(new Date(), { days: 5 }).toISOString(),
        },
        { session, new: true }
      ).exec();

      await (Transaction as any).findOneAndDelete(
        { investmentId, amount },
        { session }
      ).exec();

      await User.findByIdAndUpdate(
        userId,
        { accountBalance: 0 },
        { session, new: true, runValidators: true }
      );

      const normalizeLevel =
        (profile as any).level === 0 ? 0 : (profile as any).level - 1;
      if (updated && updated.planId >= normalizeLevel) {
        await User.findByIdAndUpdate(
          userId,
          { level: updated.planId + 1 },
          { session, new: true, runValidators: true }
        );
      }

      await (Transaction as any).create(
        [
          {
            amount: newCapital,
            investmentId,
            currentBalance: 0,
            type: 'investment',
            userId,
          },
        ],
        { session }
      );
    });

    session.endSession();

    // Send email notification
    try {
      const loginLink = `https://${DOMAIN}/login`;
      const message = `${
        (profile as any).firstName
      }, you have topped up your investment your ${
        plans[investment.planId]?.name
      } investment plan of ${fCurrency(amount)} to ${fCurrency(newCapital)}`;
      const msg = sampleMailTemplate(
        (profile as any).firstName,
        loginLink,
        message
      );
      await sendMail(msg, 'Investment Update', (profile as any).email);
    } catch (mailErr) {
      console.error('Mail error:', mailErr);
    }

    return NextResponse.json({ message: 'top up successful' }, { status: 200 });
  } catch (error: any) {
    console.error('Topup error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
