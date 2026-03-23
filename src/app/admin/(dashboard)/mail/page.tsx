'use client';

import { Container } from '@mui/material';
import MailCompose from '@/components/dashboard/MailCompose';

// ----------------------------------------------------------------------

export default function AdminMailPage() {
  return (
    <Container maxWidth="xl">
      <MailCompose />
    </Container>
  );
}
