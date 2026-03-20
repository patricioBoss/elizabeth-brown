import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Investment from '@/models/investment.model';
import User from '@/models/user.model';
import sendMail from '@/helpers/sendMail';
import sampleMailTemplate from '@/helpers/sampleMailTemplate';
import plans from '@/helpers/plans';
import { fCurrency } from '@/utils/formatNumber';
import { add } from 'date-fns';

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:8084';

// GET - Get investment by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string; investmentId: string } }
) {
  try {
    await dbConnect();

    const investment = await Investment.findById(params.investmentId).exec();

    if (!investment) {
      return NextResponse.json({ message: 'not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'success', data: investment },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update investment (pause/resume)
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string; investmentId: string } }
) {
  try {
    await dbConnect();

    const body = await request.json();
    const investment = await Investment.findById(params.investmentId).lean();

    if (!investment) {
      return NextResponse.json({ message: 'not found' }, { status: 404 });
    }

    let query: any = body;
    if (body.status === 'active') {
      query = {
        ...body,
        withDrawalDate: add(new Date(), {
          days: 5 - (investment.daysCount || 0),
        }).toISOString(),
      };
    }

    const updated = await Investment.findByIdAndUpdate(
      params.investmentId,
      query,
      { new: true }
    );

    // Send email notification if user exists
    try {
      const user = await User.findById(params.userId).lean();
      if (user) {
        const loginLink = `https://${DOMAIN}/login`;
        const message = `${user.firstName}, your ${
          plans[updated!.planId]?.name
        } investment plan of ${fCurrency(updated!.capital)} is pending and awaiting approval. <br/> All pending investment will be approved within the next 24 hours`;
        const msg = sampleMailTemplate(user.firstName, loginLink, message);
        await sendMail(msg, 'Investment Update', user.email);
      }
    } catch (mailErr) {
      console.error('Mail error:', mailErr);
    }

    return NextResponse.json(
      { message: 'success', data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete investment (only pending)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { userId: string; investmentId: string } }
) {
  try {
    await dbConnect();

    const investment = await Investment.findById(params.investmentId).lean();

    if (!investment) {
      return NextResponse.json({ message: 'not found' }, { status: 404 });
    }

    if (investment.status === 'active') {
      return NextResponse.json(
        { message: 'cannot delete active investment' },
        { status: 400 }
      );
    }

    if (investment.status === 'ended') {
      return NextResponse.json(
        { message: 'this investment has already ended' },
        { status: 400 }
      );
    }

    await Investment.findByIdAndDelete(params.investmentId);

    return NextResponse.json(
      { message: 'deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
