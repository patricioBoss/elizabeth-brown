'use client';

import { capitalCase } from 'change-case';
// @mui
import { useTheme } from '@mui/material/styles';
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
import { fDateShort } from '@/utils/formatTime';
import Scrollbar from '@/components/scrollbar';
import numeral from 'numeral';
import Image from 'next/image';

// ----------------------------------------------------------------------

interface CoinData {
  image: string;
  name: string;
  current_price: number;
}

interface RowData {
  _id: string;
  lastName: string;
  firstName: string;
  approvedAt: string;
  coin: string;
  amount: number;
}

interface LeadersTableProps {
  row: RowData[];
  coinMap: Record<string, CoinData>;
  order: string;
}

// ----------------------------------------------------------------------

export default function LeadersTable({ row, coinMap, order }: LeadersTableProps) {
  const theme = useTheme();

  return (
    <Card>
      <CardHeader title={`${capitalCase(order)} List`} sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Trans Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Coin</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    <div className=" text-black font-bold md:text-base">
                      <p className="line-clamp-1">{row._id.slice(15, 24)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {`${row.lastName} ${row.firstName}`}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {fDateShort(row.approvedAt)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className=" text-black  md:text-base flex items-center gap-2">
                      <Image
                        src={coinMap[row.coin].image}
                        width={48}
                        height={48}
                        alt="coin"
                      />
                      {coinMap[row.coin].name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {numeral(
                        row.amount / coinMap[row.coin].current_price
                      ).format('0,0.000')}{' '}
                      {capitalCase(row.coin)}
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
