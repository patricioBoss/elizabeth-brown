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
import User from '@/models/user.model';
// Client component
import ReferralListClient from './ReferralListClient';

// ----------------------------------------------------------------------

export default async function ReferralListPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  await dbConnect();

  const affiliateUsers = await User.find({ referer: user._id })
    .sort({ createdAt: -1 })
    .lean();

  // Serialize to plain objects before passing to Client Component
  const plainUser = JSON.parse(JSON.stringify(user));
  const plainAffiliates = JSON.parse(JSON.stringify(affiliateUsers));

  return <ReferralListClient user={plainUser} affiliateUsers={plainAffiliates} />;
}
