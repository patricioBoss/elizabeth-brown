'use client';

import { Container, Pagination } from '@mui/material';
import { useRouter } from '@bprogress/next';
import { useSearchParams } from 'next/navigation';
import AdminDepositListtable from '@/components/dashboard/AdminFeeListtable';

// ----------------------------------------------------------------------

interface UserId {
  _id: string;
  userName?: string;
  email?: string;
}

interface DepositRow {
  _id: string;
  createdAt: string;
  coin?: string;
  reason?: string;
  transactionId?: string;
  amount: number;
  userId: UserId;
  status: string;
  [key: string]: any;
}

// ----------------------------------------------------------------------

interface Props {
  invtList: DepositRow[];
  paginationCount: number;
  currentPage: number;
}

export default function AdminFeeClient({ invtList, paginationCount, currentPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageHandler = (_e: React.ChangeEvent<unknown>, page: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('page', String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <Container maxWidth="xl">
      <AdminDepositListtable rows={invtList} key={100 * Math.random()} />
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
