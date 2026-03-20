import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user.model';

// PUT - Update user wallet
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    
    const { usdt, btc, eth } = await request.json();
    
    const updateData: any = {};
    if (usdt !== undefined) updateData['wallets.usdt'] = usdt;
    if (btc !== undefined) updateData['wallets.btc'] = btc;
    if (eth !== undefined) updateData['wallets.eth'] = eth;
    
    const updatedUser = await User.findByIdAndUpdate(
      params.userId,
      { $set: updateData },
      { new: true }
    ).lean();
    
    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    const { password, ...user } = updatedUser;
    
    return NextResponse.json(
      { message: 'Wallet updated successfully', data: user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update wallet error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
