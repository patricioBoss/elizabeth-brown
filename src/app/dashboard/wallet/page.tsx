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
// Client component
import WalletClient from './WalletClient';

// ----------------------------------------------------------------------

export default async function WalletPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Serialize to plain object before passing to Client Component
  const plainUser = JSON.parse(JSON.stringify(user));

  return <WalletClient user={plainUser} />;
}
