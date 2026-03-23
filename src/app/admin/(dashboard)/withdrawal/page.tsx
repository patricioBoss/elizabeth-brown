import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session';
import dbConnect from '@/utils/dbConnect';
import Withdrawal from '@/models/withdrawal.model';
import AdminWithdrawalClient from './AdminWithdrawalClient';

// ----------------------------------------------------------------------

export default async function AdminWithdrawalPage({ searchParams }: { searchParams: { page?: string } }) {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  await dbConnect();

  const page = Number(searchParams?.page) || 1;
  const pageSize = 20;

  const withdrawalListRaw = await Withdrawal.find({})
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .populate({ path: 'userId', select: 'email _id' })
    .lean();

  const withDrawalCount = await Withdrawal.countDocuments({});

  const withdrawalList = JSON.parse(JSON.stringify(withdrawalListRaw));
  const paginationCount = Math.ceil(withDrawalCount / pageSize);

  return <AdminWithdrawalClient withdrawalList={withdrawalList} paginationCount={paginationCount} currentPage={page} />;
}
