import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user.model';
import { jwtSign } from '@/apiUtil/jwt';
import sendMail from '@/helpers/sendMail';
import resetPasswordMailTemplate from '@/helpers/resetPasswordMailTemplate';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_at_least_32_characters';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Parse body
    const { email } = await request.json();
    
    // Validate
    if (!email) {
      return NextResponse.json(
        { type: 'failure', message: 'Invalid email' },
        { status: 400 }
      );
    }
    
    // Find user
    const fetchedUser = await User.findOne({ email }).lean();
    
    if (!fetchedUser) {
      return NextResponse.json(
        { type: 'failure', message: 'No Account Found' },
        { status: 404 }
      );
    }
    
    // Create token
    const token = await jwtSign({ user: fetchedUser._id }, JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    
    // Create reset link
    const headers = request.headers;
    const host = headers.get('host') || 'localhost:8084';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const verificationLink = `${protocol}://${host}/reset/${token}`;
    
    // Send email
    const msg = resetPasswordMailTemplate(fetchedUser.firstName, verificationLink);
    const subject = 'Ethervest Reset';
    const sent = await sendMail(msg, subject, fetchedUser.email);
    
    if (sent) {
      return NextResponse.json(
        { message: 'Check Email for reset Link' },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { message: 'Error sending mail' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
