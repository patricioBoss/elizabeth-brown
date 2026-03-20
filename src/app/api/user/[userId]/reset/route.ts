import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user.model';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

// POST - Update password with profile
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const { newPassword, oldPassword } = await request.json();
    const userId = params.userId;

    const fetchedUser = await User.findById(userId).lean();

    if (!fetchedUser) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    // Check if password match
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      (fetchedUser as any).password
    );

    if (!isPasswordMatch) {
      return NextResponse.json({ message: 'invalid old password' }, { status: 401 });
    }

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hash },
      { new: true }
    ).lean();

    const { password, ...user } = updatedUser;

    return NextResponse.json({ message: 'password updated successfully', data: user }, { status: 200 });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
