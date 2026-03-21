import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import sessionOptions from '@/config/iron-session';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Parse body
    const { email, password } = await request.json();
    
    // Validate fields
    if (!email || !password) {
      return NextResponse.json(
        { type: 'failure', message: 'Invalid email or password' },
        { status: 400 }
      );
    }
    
    // Find user
    const fetchedUser = await User.findOne({ email }).lean();
    
    if (!fetchedUser) {
      return NextResponse.json(
        { type: 'failure', message: 'Credentials does not exist!' },
        { status: 404 }
      );
    }
    
    // Check password
    const isPasswordMatch = await bcrypt.compare(password, fetchedUser.password);
    
    if (!isPasswordMatch) {
      return NextResponse.json(
        { type: 'failure', message: 'Invalid Credentials!' },
        { status: 401 }
      );
    }
    
    // Remove password from user object
    const { password: _, ...user } = fetchedUser;
    
    // Create response with session
    const response = NextResponse.json(
      { message: 'User retrieved successfully', data: user },
      { status: 200 }
    );
    
    // Set session in response cookies
    const session = await getIronSession(request, response, sessionOptions);
    (session as any).user = user;
    await session.save();
    
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
