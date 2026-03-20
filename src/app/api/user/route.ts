import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import sessionOptions from '@/config/iron-session';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user.model';
import bcrypt from 'bcrypt';
import { jwtSign } from '@/apiUtil/jwt';
import sendMail from '@/helpers/sendMail';
import welcomeMail from '@/helpers/welcomeMail';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_at_least_32_characters';
const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:8084';

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
    const savedUser = await user.save();
    
    // Send welcome email (optional, don't fail if email fails)
    try {
      const loginLink = `https://${DOMAIN}/login`;
      const msg = welcomeMail(userData.firstName, loginLink);
      await sendMail(msg, 'Welcome to Elizabeth Brown Wealth Management', userData.email);
    } catch (emailError) {
      console.error('Welcome email error:', emailError);
      // Don't fail registration if email fails
    }
    
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
