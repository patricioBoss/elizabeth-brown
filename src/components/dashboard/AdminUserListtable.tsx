'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import {
  Typography,
  TextField,
  Modal,
  Button,
  MenuItem,
  Divider,
  IconButton,
  Link,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Label from '@/components/label';
import { visuallyHidden } from '@mui/utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import CustomPopover from '@/components/custom-popover';
import { CgMoreVertical } from 'react-icons/cg';
import { TrashIcon } from '@heroicons/react/24/outline';
import DeleteUserModal from './DeleteUserModal';
import UserDetailsModal from './UserDetailsModal';

// ----------------------------------------------------------------------

type Order = 'asc' | 'desc';

interface UserRow {
  _id: string;
  firstName?: string;
  email?: string;
  IdImg?: string;
  isVerified?: boolean;
  loading?: boolean;
  [key: string]: any;
}

interface HeadCell {
  id: string;
  numeric: boolean;
  disablePadding: boolean;
  label: string;
}

const headCells: HeadCell[] = [
  { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
  { id: 'firstName', numeric: false, disablePadding: false, label: 'firstName' },
  { id: 'email', numeric: false, disablePadding: false, label: 'email' },
  { id: 'IdImg', numeric: false, disablePadding: false, label: 'ID Image' },
  { id: 'isVerified', numeric: false, disablePadding: false, label: 'isVerified' },
];

// ----------------------------------------------------------------------

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

interface EnhancedTableHeadProps {
  order: Order;
  orderBy: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
}

function EnhancedTableHead({ order, orderBy, onRequestSort }: EnhancedTableHeadProps) {
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align={'left'} padding={'normal'} sortDirection={order}>
          <TableSortLabel>
            <></>
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

// ----------------------------------------------------------------------

interface EnhancedTableProps {
  rows: UserRow[];
}

export default function EnhancedTable({ rows }: EnhancedTableProps) {
  const [userList, setUserList] = useState<UserRow[]>(
    rows.map((x) => ({ ...x, loading: false }))
  );
  const [order, setOrder] = useState<Order>('asc');
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserRow | undefined>();
  const [orderBy, setOrderBy] = useState('firstName');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDeleteModal = (user: UserRow) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleDetailsModal = (user: UserRow) => {
    setCurrentUser(user);
    setDetailsOpen(true);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleVerify = (id: string) => {
    setUserList((x) =>
      x.map((x) => ({
        ...x,
        loading: x._id === id,
      }))
    );
    axios
      .get(`/api/user/verify/${id}`)
      .then((res) => {
        setUserList((x) =>
          x.map((x) => ({
            ...x,
            loading: false,
            isVerified: x._id === id ? !x.isVerified : x.isVerified,
          }))
        );
        toast.success(res.data.message);
      })
      .catch((err) => {
        setUserList((x) =>
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <DeleteUserModal
        setUsers={setUserList}
        open={open}
        setOpen={setOpen}
        user={currentUser}
      />
      <UserDetailsModal
        open={detailsOpen}
        setOpen={setDetailsOpen}
        user={currentUser}
      />
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(userList, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover tabIndex={-1} key={row._id}>
                    <TableCell align="left">
                      {row._id.toUpperCase().slice(0, 6) + '...'}
                    </TableCell>
                    <TableCell align="left">{row.firstName}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">
                      {row.IdImg ? (
                        <Link href={row.IdImg}>Click here</Link>
                      ) : (
                        <p>no id image yet</p>
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {' '}
                      <Label
                        variant={'soft'}
                        color={!row.isVerified ? 'warning' : 'success'}
                      >
                        {!row.isVerified ? 'not Verified' : 'Verified'}
                      </Label>
                    </TableCell>
                    <TableCell align="left">
                      <MoreMenuButton
                        user={row}
                        handleVerify={handleVerify}
                        handleModal={() => handleDeleteModal(row)}
                        handleDetails={() => handleDetailsModal(row)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
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

interface AddBonusProps {
  user: UserRow;
}

function AddBonus({ user }: AddBonusProps) {
  const { _id } = user;
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
      .put(`/api/user/${_id}/bonus`, { bonus: value })
      .then((res) => {
        setLoading(false);
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
      <Button variant="contained" onClick={handleOpen}>
        Add Bonus
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography mb={4} variant="subtitle2">
            Note: This is for only active Users
          </Typography>
          <TextField onChange={handleChange} value={value} type={'number'} />
          <LoadingButton
            onClick={handleAdd}
            loading={loading}
            variant="contained"
          >
            <span>Add Bonus </span>
          </LoadingButton>
        </Box>
      </Modal>
    </div>
  );
}

// ----------------------------------------------------------------------

interface MoreMenuButtonProps {
  user: UserRow;
  handleVerify: (id: string) => void;
  handleModal: () => void;
  handleDetails: () => void;
}

function MoreMenuButton({ user, handleVerify, handleModal, handleDetails }: MoreMenuButtonProps) {
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
        <MenuItem onClick={handleDetails}>View Details</MenuItem>
        <MenuItem>
          {!user.isVerified ? (
            <LoadingButton
              variant="contained"
              loading={user.loading}
              onClick={() => handleVerify(user._id)}
            >
              <span> Verify Now </span>
            </LoadingButton>
          ) : (
            <AddBonus user={user} />
          )}
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ color: 'error.main' }} onClick={handleModal}>
          <TrashIcon className=" mr-2 w-[20px] h-[20px]" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
