import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';

interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export function UserDisplay({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user data based on userId
    async function fetchUser() {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUser(data);
    }
    fetchUser();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <img src={user.avatarUrl} alt={user.name} />
      <span>{user.name}</span>
    </Stack>
  );
}