'use client';

import { Container, Typography } from '@mui/material';
import AdminUserListtable from '@/components/dashboard/AdminUserListtable';

// ----------------------------------------------------------------------

interface UserRow {
  _id: string;
  firstName?: string;
  email?: string;
  IdImg?: string;
  isVerified?: boolean;
  [key: string]: any;
}

// ----------------------------------------------------------------------

interface Props {
  userList: UserRow[];
}

export default function AdminHomeClient({ userList }: Props) {
  return (
    <Container maxWidth="xl">
      <Typography variant="h3">User List</Typography>
      <AdminUserListtable rows={userList} />
    </Container>
  );
}
