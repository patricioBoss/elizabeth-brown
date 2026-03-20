import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'All Referral',
};

// ----------------------------------------------------------------------

// Force dynamic rendering since this page uses cookies/session
export const dynamic = 'force-dynamic';
import dbConnect from '@/utils/dbConnect';
import Transaction from '@/models/transaction.model';
// Client component
import ReferralCommissionClient from './ReferralCommissionClient';

// ----------------------------------------------------------------------

export default async function ReferralCommissionPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  await dbConnect();

  const referralCommissions = await Transaction.find({ userId: user._id, type: 'referral' })
    .populate({ path: 'userId', select: 'email _id' })
    .sort({ createdAt: -1 })
    .lean();

  // Serialize to plain objects before passing to Client Component
  const plainUser = JSON.parse(JSON.stringify(user));
  const plainCommissions = JSON.parse(JSON.stringify(referralCommissions));

  return <ReferralCommissionClient user={plainUser} referralCommissions={plainCommissions} />;
}
