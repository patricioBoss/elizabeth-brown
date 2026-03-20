// Iron Session types
import 'iron-session';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
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
    };
  }
}

export {};
