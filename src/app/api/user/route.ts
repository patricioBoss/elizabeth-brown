import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

// GET - Get all users
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const allUsers = await User.find({});
    return NextResponse.json(
      { message: 'Fetched users successfully', data: allUsers },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userData = await request.json();
    
    // Check if email exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with email already exists' },
        { status: 400 }
      );
    }
    
    // Remove confirmPassword
    delete userData.confirmPassword;
    
    // Hash password
    const hash = await bcrypt.hash(userData.password, SALT_ROUNDS);
    userData.password = hash;
    
    // Create user
    const user = new User(userData);
    await user.save();
    
    // Email sending disabled for testing timeout issues
    // TODO: Re-enable after fixing timeout
    
    return NextResponse.json(
      { message: 'Successfully signed up!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
