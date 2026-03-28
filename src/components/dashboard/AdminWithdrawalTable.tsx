'use client';

import { sentenceCase } from 'change-case';
// @mui
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  MenuItem,
  Divider,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import { fDate } from '@/utils/formatTime';
import { fCurrency } from '@/utils/formatNumber';
import Scrollbar from '@/components/scrollbar';
import Label from '@/components/label';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TrashIcon } from '@heroicons/react/24/outline';
import CustomPopover from '@/components/custom-popover';
import { CgMoreVertical } from 'react-icons/cg';
import { useRouter } from '@bprogress/next';
import DeleteWithdrawalModal from './DeleteWithdrawalModal';

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
  loading?: boolean;
  [key: string]: any;
}

interface AdminWithdrawalTableProps {
  rows: WithdrawalRow[];
}

// ----------------------------------------------------------------------

export default function AppNewInvoice({ rows }: AdminWithdrawalTableProps) {
  const theme = useTheme();
  const [currentInvt, setCurrentInvt] = useState<WithdrawalRow>({} as WithdrawalRow);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<WithdrawalRow[]>(
    rows.map((x) => ({
      ...x,
      loading: false,
    }))
  );

  const handleDelete = (investment: WithdrawalRow) => {
    setCurrentInvt(investment);
    setOpen(true);
  };

  const handleApproval = (row: WithdrawalRow) => {
    const { userId, _id } = row;
    setList((x) =>
      x.map((x) => ({
        ...x,
        loading: x._id === _id,
      }))
    );
    axios
      .get(`/api/user/${userId._id}/withdraw/${_id}`)
      .then((res) => {
        setList((x) =>
          x.map((x) => ({
            ...x,
            loading: false,
          }))
        );
        toast.success(res.data.message);
      })
      .catch((err) => {
        setList((x) =>
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

  return (
    <Scrollbar>
      <DeleteWithdrawalModal open={open} setOpen={setOpen} investment={currentInvt} />
      <TableContainer sx={{ minWidth: 720 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Coin</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date Requested</TableCell>
              <TableCell>Status</TableCell>
              <TableCell> </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row._id}</TableCell>
                <TableCell>{row.currency}</TableCell>
                <TableCell>{fCurrency(row.amount)}</TableCell>
                <TableCell>{row.userId.email}</TableCell>
                <TableCell>{fDate(row.createdAt)}</TableCell>
                <TableCell>
                  <Label
                    variant={
                      theme.palette.mode === 'light' ? 'soft' : 'filled'
                    }
                    color={
                      (row.status === 'pending' && 'warning') ||
                      (row.status === 'paid' && 'success') ||
                      (row.status === 'cancelled' && 'error') ||
                      'default'
                    }
                  >
                    {sentenceCase(row.status)}
                  </Label>
                </TableCell>
                <TableCell>
                  <MoreMenuButton
                    handleActive={handleApproval}
                    row={row}
                    handleDeleteModal={handleDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
}

// ----------------------------------------------------------------------

interface MoreMenuButtonProps {
  row: WithdrawalRow;
  handleActive: (row: WithdrawalRow) => void;
  handleDeleteModal: (row: WithdrawalRow) => void;
}

function MoreMenuButton({ row, handleActive, handleDeleteModal }: MoreMenuButtonProps) {
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [loadCancel, setLoadCancel] = useState(false);
  const router = useRouter();

  const refresh = () => {
    router.refresh();
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleCancel = () => {
    setLoadCancel(true);
    axios
      .put(`/api/withdrawal/${row._id}`)
      .then((res) => {
        toast.success(res.data.message);
        refresh();
      })
      .catch((err) => {
        if (err.response) {
          toast.error('error, pls try again');
        } else {
          toast.error(err.message);
        }
      })
      .finally(() => {
        setLoadCancel(false);
      });
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
            <span>Approve withdrawal </span>
          </LoadingButton>
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />
        {row.status === 'cancelled' && (
          <MenuItem sx={{ color: 'error.main' }} onClick={() => handleDeleteModal(row)}>
            <TrashIcon className=" mr-2 w-[20px] h-[20px]" />
            Delete
          </MenuItem>
        )}
        <MenuItem sx={{ color: 'warning.main' }}>
          <LoadingButton
            color="error"
            loading={loadCancel}
            onClick={handleCancel}
          >
            Cancel
          </LoadingButton>
        </MenuItem>
      </CustomPopover>
    </>
  );
}

// ----------------------------------------------------------------------
