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
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Divider, IconButton, MenuItem, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import plans from '@/helpers/plans';
import { toast } from 'react-toastify';
import axios from 'axios';
import Scrollbar from '@/components/scrollbar';
import { TrashIcon } from '@heroicons/react/24/outline';
import { CgMoreVertical } from 'react-icons/cg';
import CustomPopover from '@/components/custom-popover';
import DeleteInvestmentModal from './DeleteInvestmentModal';
import { useRouter } from '@bprogress/next';

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
  loading?: boolean;
  [key: string]: any;
}

interface AdminInvestmentListtableProps {
  rows: InvestmentRow[];
}

// ----------------------------------------------------------------------

export default function InvestmentTable({ rows }: AdminInvestmentListtableProps) {
  const [open, setOpen] = useState(false);
  const [currentInvt, setCurrentInvt] = useState<InvestmentRow>({} as InvestmentRow);
  const router = useRouter();
  const [invtList, setInvList] = useState<InvestmentRow[]>(
    rows.map((x) => ({
      ...x,
      loading: false,
    }))
  );

  const headCells = [
    'ID',
    'Date',
    'Coin',
    'Transaction ID',
    'Capital',
    'email',
    'Earning',
    'daily count',
    'status',
    '',
    '',
  ];

  const theme = useTheme();

  const handleActive = (row: InvestmentRow) => {
    const { _id, userId } = row;
    setInvList((x) =>
      x.map((x) => ({
        ...x,
        loading: x._id === _id,
      }))
    );
    axios
      .post(`/api/user/${userId._id}/invest/${_id}/approve`)
      .then((res) => {
        setInvList((x) =>
          x.map((x) => ({
            ...x,
            loading: false,
          }))
        );
        router.refresh();
        toast.success(res.data.message);
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

  const handleDelete = (investment: InvestmentRow) => {
    setCurrentInvt(investment);
    setOpen(true);
  };

  return (
    <>
      {' '}
      <DeleteInvestmentModal
        open={open}
        setOpen={setOpen}
        investment={currentInvt}
      />
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
                    <TableCell align="left">{row.stock}</TableCell>
                    <TableCell align="left">{row.transactionId}</TableCell>
                    <TableCell align="left">{row.capital}</TableCell>
                    <TableCell align="left">{row.userId.email}</TableCell>

                    <TableCell align="left">
                      {plans[row.planId!]
                        ? fCurrency(
                            (plans[row.planId!].interest / 100) * row.capital
                          )
                        : 'No plan yet'}
                    </TableCell>
                    <TableCell align="left">{row.daysCount}</TableCell>
                    <TableCell align="left">
                      <Label
                        variant={
                          (theme as any).palette?.mode === 'light' ? 'soft' : 'filled'
                        }
                        color={
                          (row.status === 'pending' && 'warning') ||
                          (row.status === 'paused' && 'default') ||
                          (row.status === 'ended' && 'error') ||
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

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface AddActiveProps {
  investment: InvestmentRow;
  reload: () => void;
}

function AddActive({ investment, reload }: AddActiveProps) {
  const { _id, userId } = investment;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleAdd = () => {
    setLoading(true);
    axios
      .post(`/api/user/${userId._id}/invest/${_id}/daily`, { daily: value })
      .then((res) => {
        setLoading(false);
        reload();
        toast.success(res.data.message);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          toast.error('error, pls try again');
        } else {
          toast.error(err.message);
        }
      });
  };

  return (
    <div>
      <Button onClick={handleOpen}>Add Daily</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography mb={4} variant="subtitle2">
            Note: This is for only active investments
          </Typography>
          <TextField onChange={handleChange} value={value} type={'number'} />
          <LoadingButton
            onClick={handleAdd}
            loading={loading}
            variant="contained"
          >
            <span>Add to daily Rio</span>
          </LoadingButton>
        </Box>
      </Modal>
    </div>
  );
}

// ----------------------------------------------------------------------

interface MoreMenuButtonProps {
  row: InvestmentRow;
  handleActive: (row: InvestmentRow) => void;
  handleDeleteModal: () => void;
}

function MoreMenuButton({ row, handleActive, handleDeleteModal }: MoreMenuButtonProps) {
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const refresh = () => {
    router.refresh();
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handlePauseInvestment = (row: InvestmentRow, status: string) => {
    setIsLoading(true);
    axios
      .put(`/api/invest/${row._id}/`, { status })
      .then((res) => {
        refresh();
        setIsLoading(false);
        toast.success(res.data.message);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response) {
          toast.error('error, pls try again');
        } else {
          toast.error(err.message);
        }
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
          {row.status === 'pending' ? (
            <LoadingButton
              onClick={() => handleActive(row)}
              loading={row.loading}
              variant="contained"
              color="success"
            >
              <span>Approve investment</span>
            </LoadingButton>
          ) : row.status === 'active' ? (
            <LoadingButton
              onClick={() => handlePauseInvestment(row, 'paused')}
              loading={isloading}
            >
              <span>Pause Investment</span>
            </LoadingButton>
          ) : row.status === 'paused' ? (
            <LoadingButton
              onClick={() => handlePauseInvestment(row, 'active')}
              loading={isloading}
            >
              <span>Resume Investment</span>
            </LoadingButton>
          ) : (
            <></>
          )}
        </MenuItem>
        <MenuItem>
          <AddActive investment={row} reload={refresh} />
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
