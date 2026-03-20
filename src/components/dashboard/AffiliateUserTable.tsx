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
import { fDateShort } from '@/utils/formatTime';
import Scrollbar from '@/components/scrollbar';

// ----------------------------------------------------------------------

interface AffiliateUser {
  _id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  isVerified: boolean;
}

interface AffiliateUserTableProps {
  row: AffiliateUser[];
}

// ----------------------------------------------------------------------

export default function AffiliateUserTable({ row }: AffiliateUserTableProps) {
  return (
    <Card>
      <CardHeader title="Referral List" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>date Joined</TableCell>
                <TableCell>Verification</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {`${item.lastName} ${item.firstName}`}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {fDateShort(item.createdAt)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className=" text-black  md:text-base">
                      {item.isVerified ? 'Verified' : 'UnVerified'}
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
