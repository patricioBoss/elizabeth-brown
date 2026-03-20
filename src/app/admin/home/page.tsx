import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user.model';
import AdminHomeClient from './AdminHomeClient';

// ----------------------------------------------------------------------

export default async function AdminHomePage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  await dbConnect();

  const userListRaw = await User.find({}).lean();
  const userList = JSON.parse(JSON.stringify(userListRaw));

  return <AdminHomeClient userList={userList} />;
}
