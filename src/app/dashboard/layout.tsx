import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import DashboardLayout from '@/layouts/dashboard';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Force dynamic rendering since this layout uses cookies/session
export const dynamic = 'force-dynamic';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  // Server-side auth check
  const user = await getCurrentUser();
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }
  
  const plainUser = JSON.parse(JSON.stringify(user));

  return <DashboardLayout user={plainUser}>{children}</DashboardLayout>;
}
