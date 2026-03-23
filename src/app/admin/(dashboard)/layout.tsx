import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/session';
import AdminLayout from '@/layouts/admin';

// ----------------------------------------------------------------------

// Force dynamic rendering since this layout uses cookies/session
export const dynamic = 'force-dynamic';

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  // Get current pathname from headers
  const headersList = headers();
  const pathname = headersList.get('x-invoke-path') || '';
  
  // Skip auth check for login page
  if (pathname === '/admin/login' || pathname.endsWith('/admin/login')) {
    return <>{children}</>;
  }
  
  // Server-side auth check for all other admin pages
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
