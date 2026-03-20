import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user.model';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

// PUT - Change password
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    
    const { currentPassword, newPassword } = await request.json();
    
    const user = await User.findById(params.userId);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 401 }
      );
    }
    
    // Hash new password
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hash;
    await user.save();
    
    return NextResponse.json(
      { message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
