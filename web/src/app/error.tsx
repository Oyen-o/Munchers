import { Stack } from '@mui/material';

export function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <img src="/images/crash.png" alt="Error" width={400} height={400} />
    </Stack>
  );
}
