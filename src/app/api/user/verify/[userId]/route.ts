import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user.model';
import sendMail from '@/helpers/sendMail';
import sampleMailTemplate from '@/helpers/sampleMailTemplate';

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:8084';

// GET - Verify user
export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const userId = params.userId;
    const profile = await User.findById(userId).lean();

    if (!profile) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    await User.findOneAndUpdate({ _id: userId }, { isVerified: true });

    const loginLink = `https://${DOMAIN}/login`;
    const message =
      'Your account has been Verified, you can start exploring the full app features on your path to financial freedom.';
    const msg = sampleMailTemplate((profile as any).firstName, loginLink, message);
    await sendMail(msg, 'Verification Successful', (profile as any).email);

    return NextResponse.json({ message: 'verification successful' }, { status: 200 });
  } catch (error: any) {
    console.error('Verify user error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
