'use client';

import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Label from '@/components/label';
import { fDate } from '@/utils/formatTime';
import { fCurrency } from '@/utils/formatNumber';
import { useTheme } from '@mui/system';
import { sentenceCase } from 'change-case';
import { Divider, IconButton, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import axios from 'axios';
import Scrollbar from '@/components/scrollbar';
import { TrashIcon } from '@heroicons/react/24/outline';
import { CgMoreVertical } from 'react-icons/cg';
import CustomPopover from '@/components/custom-popover';
import { useRouter } from 'next/navigation';
import DeleteFeeModal from './DeleteFeeModal';

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
  loading?: boolean;
  [key: string]: any;
}

interface AdminFeeListtableProps {
  rows: DepositRow[];
}

// ----------------------------------------------------------------------

export default function AdminFeeTable({ rows }: AdminFeeListtableProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [currentInvt, setCurrentInvt] = useState<DepositRow>({} as DepositRow);

  const [invtList, setInvList] = useState<DepositRow[]>(
    rows.map((x) => ({
      ...x,
      loading: false,
    }))
  );

  const headCells = [
    'ID',
    'Date',
    'Coin',
    'Procedure',
    'Transaction ID',
    'Amount',
    'Username',
    'email',
    'status',
    '',
    '',
  ];

  const refresh = () => {
    router.refresh();
  };

  const theme = useTheme();

  const handleActive = (row: DepositRow) => {
    const { _id, userId } = row;
    setInvList((x) =>
      x.map((x) => ({
        ...x,
        loading: x._id === _id,
      }))
    );
    axios
      .post(`/api/user/${userId._id}/deposit/${_id}/`)
      .then((res) => {
        setInvList((x) =>
          x.map((x) => ({
            ...x,
            loading: false,
          }))
        );
        toast.success(res.data.message);
        refresh();
      })
      .catch((err) => {
        setInvList((x) =>
          x.map((x) => ({
            ...x,
            loading: false,
          }))
        );
        if (err.response) {
          toast.error('error, pls try again');
        } else {
          toast.error(err.message);
        }
      });
  };

  const handleDelete = (deposit: DepositRow) => {
    setCurrentInvt(deposit);
    setOpen(true);
  };

  return (
    <>
      {' '}
      <DeleteFeeModal open={open} setOpen={setOpen} deposit={currentInvt} />
      <Scrollbar>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {headCells.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {!!invtList.length &&
                invtList.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left">{row._id.slice(0, 6)}</TableCell>
                    <TableCell align="left">{fDate(row.createdAt)}</TableCell>
                    <TableCell align="left">{row.coin}</TableCell>
                    <TableCell align="left">{row.reason}</TableCell>
                    <TableCell align="left">{row.transactionId}</TableCell>
                    <TableCell align="left">{fCurrency(row.amount)}</TableCell>
                    <TableCell align="left">{row.userId.userName}</TableCell>
                    <TableCell align="left">{row.userId.email}</TableCell>
                    <TableCell align="left">
                      <Label
                        variant={
                          (theme as any).palette?.mode === 'light' ? 'soft' : 'filled'
                        }
                        color={
                          (row.status === 'pending' && 'warning') ||
                          'success'
                        }
                      >
                        {sentenceCase(row.status)}
                      </Label>
                    </TableCell>
                    <TableCell align="center">
                      <MoreMenuButton
                        row={row}
                        handleActive={handleActive}
                        handleDeleteModal={() => handleDelete(row)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </>
  );
}

// ----------------------------------------------------------------------

interface MoreMenuButtonProps {
  row: DepositRow;
  handleActive: (row: DepositRow) => void;
  handleDeleteModal: () => void;
}

function MoreMenuButton({ row, handleActive, handleDeleteModal }: MoreMenuButtonProps) {
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton size="large" onClick={handleOpen}>
        <CgMoreVertical width={20} height={20} />
      </IconButton>

      <CustomPopover
        open={open}
        onClose={handleClose}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 160,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <MenuItem>
          <LoadingButton
            onClick={() => handleActive(row)}
            loading={row.loading}
            variant="contained"
            color="success"
          >
            <span>Approve Fee</span>
          </LoadingButton>
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteModal}>
          <TrashIcon className=" mr-2 w-[20px] h-[20px]" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
