import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/utils/dbConnect';
import Deposit from '@/models/deposit.model';
import Transaction from '@/models/transaction.model';
import User from '@/models/user.model';
import sendMail from '@/helpers/sendMail';
import sampleMailTemplate from '@/helpers/sampleMailTemplate';

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:8084';

// GET - Get deposit by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string; depositId: string } }
) {
  try {
    await dbConnect();

    const deposit = await Deposit.findById(params.depositId).lean();

    if (!deposit) {
      return NextResponse.json({ message: 'not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'success', data: deposit },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Approve deposit (admin route)
export async function PUT(
  _request: NextRequest,
  { params }: { params: { userId: string; depositId: string } }
) {
  try {
    await dbConnect();

    const deposit = await Deposit.findById(params.depositId).lean();
    if (!deposit) {
      return NextResponse.json({ message: 'not found' }, { status: 404 });
    }

    const profile = await User.findById(params.userId).lean();
    if (!profile) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    const loginLink = `https://${DOMAIN}/login`;

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      await Deposit.findByIdAndUpdate(
        params.depositId,
        { approvedDate: Date.now(), status: 'approved' },
        { session, new: true }
      ).exec();

      let message: string;
      const reason = (deposit as any).reason?.toLowerCase();
      const amount = (deposit as any).amount;
      const firstName = (profile as any).firstName;
      const accountBalance = (profile as any).accountBalance;

      if (reason === 'activation') {
        message = `Congratulations ${firstName}!,
        This is to inform you that your trading account is now connected to our S9 trading signal you'll start earning on your account
        Note do not share any details about your account so they won't get access to your asset.
        Enjoy daily Rio on investment🚀🚀. <br/>
        Your FEE of $${amount} for ${(deposit as any).reason} has been approved and you can now reinvest up to $${
          accountBalance + parseInt(amount)
        } now.`;
      } else {
        message = `${firstName}, your FEE of $${amount} for ${(deposit as any).reason} has been approved and you can now reinvest up to $${
          accountBalance + parseInt(amount)
        } now.`;
      }

      const msg = sampleMailTemplate(firstName, loginLink, message);

      if (reason !== 'upgrade') {
        await sendMail(
          msg,
          reason === 'activation' ? 'Activation successful' : 'FEE Update',
          (profile as any).email
        );
      }

      await User.findByIdAndUpdate(
        params.userId,
        { $inc: { accountBalance: parseInt(amount) } },
        { session, new: true, runValidators: true }
      );

      await (Transaction as any).create(
        [
          {
            amount,
            depositId: params.depositId,
            currentBalance: accountBalance,
            type: 'fee',
            userId: params.userId,
          },
        ],
        { session }
      );
    });

    session.endSession();

    return NextResponse.json({ message: 'fee approved' }, { status: 200 });
  } catch (error: any) {
    console.error('Approve deposit error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 400 }
    );
  }
}

// DELETE - Delete deposit
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { userId: string; depositId: string } }
) {
  try {
    await dbConnect();

    const deposit = await Deposit.findByIdAndDelete(params.depositId);

    if (!deposit) {
      return NextResponse.json({ message: 'not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'deleted successfully', data: deposit },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
