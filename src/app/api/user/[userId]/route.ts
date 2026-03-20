import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user.model';

// GET - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    
    const user = await User.findById(params.userId)
      .select(['-password', '-createdAt', '-updatedAt'])
      .lean();
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'User retrieved successfully', data: user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();
    
    const updateData = await request.json();
    
    const allowedFields = ['firstName', 'lastName', 'phone', 'city', 'permanentAddress', 'country', 'state', 'postalCode'];
    const updates: any = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      params.userId,
      updates,
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
      { message: 'User updated successfully', data: user },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
