'use client';

import { Container, Pagination } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminInvestmentListtable from '@/components/dashboard/AdminInvestmentListtable';

// ----------------------------------------------------------------------

interface UserId {
  _id: string;
  email?: string;
}

interface InvestmentRow {
  _id: string;
  createdAt: string;
  stock?: string;
  transactionId?: string;
  capital: number;
  userId: UserId;
  planId?: number;
  daysCount?: number;
  status: string;
  [key: string]: any;
}

// ----------------------------------------------------------------------

interface Props {
  invtList: InvestmentRow[];
  paginationCount: number;
  currentPage: number;
}

export default function AdminInvestClient({ invtList, paginationCount, currentPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageHandler = (_e: React.ChangeEvent<unknown>, page: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('page', String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <Container maxWidth="xl">
      <AdminInvestmentListtable rows={invtList} key={100 * Math.random()} />
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
