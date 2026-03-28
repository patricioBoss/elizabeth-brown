'use client';

import { useEffect } from 'react';
import { useRouter } from '@bprogress/next';

// ----------------------------------------------------------------------

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/home');
  }, [router]);

  return null;
}
