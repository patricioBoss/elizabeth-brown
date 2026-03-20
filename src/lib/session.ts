import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import sessionOptions from '../config/iron-session';
import dbConnect from '../utils/dbConnect';
import User from '../models/user.model';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  state: string;
  role: 'User' | 'Admin';
  accountBalance: number;
  isVerified: boolean;
  imageUrl: string;
}

export async function getSession() {
  try {
    const session = await getIronSession(cookies() as any, sessionOptions);
    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getSession();
    
    if (!session || !(session as any).user) {
      return null;
    }
    
    // Connect to database
    await dbConnect();
    
    // Fetch fresh user data from database (like original pageAuthAccess.js)
    const userId = (session as any).user._id;
    const user = await User.findById(userId)
      .select(['-password', '-createdAt', '-updatedAt'])
      .lean();
    
    if (!user) {
      // User doesn't exist in DB, clear session
      session.destroy();
      return null;
    }
    
    return user as User;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== 'Admin') {
    throw new Error('Not authorized');
  }
  return user;
}
