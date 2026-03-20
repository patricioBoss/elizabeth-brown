import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import AdminLayout from '@/layouts/admin';

// ----------------------------------------------------------------------

// Force dynamic rendering since this layout uses cookies/session
export const dynamic = 'force-dynamic';

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  // Server-side auth check
  const user = await getCurrentUser();
  
  // Redirect to admin login if not authenticated or not admin
  if (!user) {
    redirect('/admin/login');
  }
  
  if (user.role !== 'Admin') {
    redirect('/admin/login');
  }
  
  const plainUser = JSON.parse(JSON.stringify(user));

  return <AdminLayout user={plainUser}>{children}</AdminLayout>;
}
