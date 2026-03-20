import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import sessionOptions from '@/config/iron-session';

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession(request, NextResponse.next(), sessionOptions);
    
    if ((session as any).user) {
      return NextResponse.json(
        { authenticated: true, user: (session as any).user },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { authenticated: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
