'use client';

import { AppProgressProvider as ProgressProvider } from '@bprogress/next';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ProgressProvider
      height="2px"
      color="#0F8EC7"
      options={{ showSpinner: false }}
      shallowRouting
      disableSameURL
    >
      {children}
    </ProgressProvider>
  );
}
