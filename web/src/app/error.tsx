'use client';
import { Stack } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ alignItems: 'center', justifyContent: 'center', height: '100vh' }}
    >
      <img src="/images/crash.png" alt="Error" width={400} height={400} />
      <h4 style={{ textAlign: 'center' }}>Oops! Something went wrong.</h4>
      <h5 style={{ textAlign: 'center' }}>{error.message}</h5>
    </Stack>
  );
}
