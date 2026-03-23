import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/session';
import dbConnect from '@/utils/dbConnect';
import Investment from '@/models/investment.model';
import AdminInvestClient from './AdminInvestClient';

// ----------------------------------------------------------------------

export default async function AdminInvestPage({ searchParams }: { searchParams: { page?: string } }) {
  try {
    await requireAdmin();
  } catch {
    redirect('/admin/login');
  }

  await dbConnect();

  const page = Number(searchParams?.page) || 1;
  const pageSize = 20;

  const invtListRaw = await Investment.find({ status: { $ne: 'ended' } })
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .populate({ path: 'userId', select: 'email _id' })
    .lean();

  const investmentCount = await Investment.countDocuments({});

  const invtList = JSON.parse(JSON.stringify(invtListRaw));
  const paginationCount = Math.ceil(investmentCount / pageSize);

  return <AdminInvestClient invtList={invtList} paginationCount={paginationCount} currentPage={page} />;
}
