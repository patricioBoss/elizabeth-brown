import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Deposit from '@/models/deposit.model';
import User from '@/models/user.model';
import sendMail from '@/helpers/sendMail';
import sampleMailTemplate from '@/helpers/sampleMailTemplate';

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:8084';

// GET - Get all deposits for a user
export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const deposits = await Deposit.find({ userId: params.userId }).exec();

    return NextResponse.json(
      { message: 'success', data: deposits },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Create a deposit (fee payment)
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const userId = params.userId;

    const profile = await User.findById(userId).lean();
    if (!profile) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    const deposit = new Deposit({
      userId,
      status: 'pending',
      ...body,
    });

    const result = await deposit.save();

    // Send email notification
    try {
      const loginLink = `https://${DOMAIN}/login`;
      const message = `${(profile as any).firstName}, you just made a FEE of ${body.amount} for ${body.reason} which is currently awaiting approval within the next 12 hrs.`;
      const msg = sampleMailTemplate(
        (profile as any).firstName,
        loginLink,
        message
      );
      await sendMail(msg, 'FEE Created', (profile as any).email);
    } catch (mailErr) {
      console.error('Mail error:', mailErr);
    }

    return NextResponse.json(
      { message: 'Fee payment success', data: result },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
