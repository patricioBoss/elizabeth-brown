import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'wallet',
};

// ----------------------------------------------------------------------

// Force dynamic rendering since this page uses cookies/session
export const dynamic = 'force-dynamic';
import dbConnect from '@/utils/dbConnect';
import Withdrawal from '@/models/withdrawal.model';
// Client component
import WithdrawalClient from './WithdrawalClient';

// ----------------------------------------------------------------------

export default async function WithdrawalPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  await dbConnect();

  const withdrawalList = await Withdrawal.find({ userId: user._id }).lean();

  // Serialize to plain objects before passing to Client Component
  const plainUser = JSON.parse(JSON.stringify(user));
  const plainWithdrawalList = JSON.parse(JSON.stringify(withdrawalList));

  return <WithdrawalClient user={plainUser} withdrawalList={plainWithdrawalList} />;
}
