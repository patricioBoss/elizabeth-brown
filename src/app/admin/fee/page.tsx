import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session';
import dbConnect from '@/utils/dbConnect';
import Deposit from '@/models/deposit.model';
import AdminFeeClient from './AdminFeeClient';

// ----------------------------------------------------------------------

export default async function AdminFeePage({ searchParams }: { searchParams: { page?: string } }) {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  await dbConnect();

  const page = Number(searchParams?.page) || 1;
  const pageSize = 20;

  const invtListRaw = await Deposit.find({ status: { $ne: 'ended' } })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .populate({ path: 'userId', select: 'email _id' })
    .lean();

  const depositCount = await Deposit.countDocuments({});

  const invtList = JSON.parse(JSON.stringify(invtListRaw));
  const paginationCount = Math.ceil(depositCount / pageSize);

  return <AdminFeeClient invtList={invtList} paginationCount={paginationCount} currentPage={page} />;
}
