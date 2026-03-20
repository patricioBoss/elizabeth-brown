// @mui
import {
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  TableContainer,
} from '@mui/material';
// utils
import { fDateTime } from '@/utils/formatTime';
import Scrollbar from '@/components/scrollbar';
import { fCurrency } from '@/utils/formatNumber';

// ----------------------------------------------------------------------

interface ReferralCommission {
  userId: {
    _id: string;
    email: string;
  };
  createdAt: string;
  amount: number;
}

interface ReferralListProps {
  row: ReferralCommission[];
}

// ----------------------------------------------------------------------

export default function ReferralList({ row }: ReferralListProps) {
  return (
    <Card>
      <CardHeader title="Referral List" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Commission</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row.map((item) => (
                <TableRow key={item.userId._id}>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {item.userId.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {fDateTime(item.createdAt)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {fCurrency(item.amount)}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------
