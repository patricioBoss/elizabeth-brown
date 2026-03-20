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
import { add } from 'date-fns';

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:8084';

// POST - Approve a pending investment (admin route)
export async function POST(
  _request: NextRequest,
  { params }: { params: { userId: string; investmentId: string } }
) {
  try {
    await dbConnect();

    const investment = await Investment.findById(params.investmentId).lean();
    if (!investment) {
      return NextResponse.json({ message: 'not found' }, { status: 404 });
    }

    const profile = await User.findById(params.userId).lean();
    if (!profile) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    const loginLink = `https://${DOMAIN}/login`;

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      await Investment.findByIdAndUpdate(
        params.investmentId,
        {
          approvedDate: Date.now(),
          status: 'active',
          withDrawalDate: add(new Date(), { days: 5 }).toISOString(),
        },
        { session, new: true }
      ).exec();

      const message = `${profile.firstName}, your ${
        plans[investment.planId]?.name
      } investment plan of ${fCurrency(
        investment.capital
      )} has been approved, enjoy daily rio on investment`;

      const msg = sampleMailTemplate(profile.firstName, loginLink, message);
      await sendMail(msg, 'Investment Update', profile.email);

      // Credit referrer 10% commission
      let referUser: any = null;
      if (profile.referer) {
        referUser = await User.findByIdAndUpdate(
          profile.referer,
          { $inc: { accountBalance: Number((10 / 100) * investment.capital) } },
          { session, new: true, runValidators: true }
        );
      }

      // Update user level based on plan
      const normalizeLevel =
        (profile as any).level === 0 ? 0 : (profile as any).level - 1;
      if (investment.planId >= normalizeLevel) {
        await User.findByIdAndUpdate(
          params.userId,
          { level: investment.planId },
          { session, new: true, runValidators: true }
        );
      }

      await (Transaction as any).create(
        [
          {
            amount: investment.capital,
            investmentId: params.investmentId,
            currentBalance: (profile as any).accountBalance,
            type: 'investment',
            userId: params.userId,
          },
          ...(profile.referer && referUser
            ? [
                {
                  amount: investment.capital,
                  investmentId: params.investmentId,
                  currentBalance: referUser.accountBalance,
                  type: 'referral',
                  userId: profile.referer,
                },
              ]
            : []),
        ],
        { session }
      );
    });

    session.endSession();

    return NextResponse.json({ message: 'investment approved' }, { status: 200 });
  } catch (error: any) {
    console.error('Approve investment error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
