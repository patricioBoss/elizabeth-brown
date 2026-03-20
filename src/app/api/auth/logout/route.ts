import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import sessionOptions from '@/config/iron-session';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next();
    const session = await getIronSession(request, response, sessionOptions);
    
    if ((session as any).user) {
      session.destroy();
      return NextResponse.json(
        { message: 'Logged out successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'No user to log out' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
