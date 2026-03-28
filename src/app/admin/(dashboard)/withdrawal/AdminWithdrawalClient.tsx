'use client';

import { Container, Pagination } from '@mui/material';
import { useRouter } from '@bprogress/next';
import { useSearchParams } from 'next/navigation';
import AdminWithdrawalTable from '@/components/dashboard/AdminWithdrawalTable';

// ----------------------------------------------------------------------

interface UserId {
  _id: string;
  email?: string;
}

interface WithdrawalRow {
  _id: string;
  currency?: string;
  amount: number;
  userId: UserId;
  createdAt: string;
  status: string;
  [key: string]: any;
}

// ----------------------------------------------------------------------

interface Props {
  withdrawalList: WithdrawalRow[];
  paginationCount: number;
  currentPage: number;
}

export default function AdminWithdrawalClient({ withdrawalList, paginationCount, currentPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageHandler = (_e: React.ChangeEvent<unknown>, page: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('page', String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <Container maxWidth="xl">
      <AdminWithdrawalTable rows={withdrawalList} key={100 * Math.random()} />
      <div className="pt-6">
        <Pagination
          defaultPage={currentPage}
          onChange={pageHandler}
          count={paginationCount}
          variant="outlined"
          size="large"
          shape="rounded"
        />
      </div>
    </Container>
  );
}
