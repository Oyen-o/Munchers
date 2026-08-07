'use client';

import {
  Avatar as MuiAvatar,
  AvatarGroup,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Avatar } from 'src/components/avatar/avatar';
import { useUsers } from 'src/lib/hooks/use-user-cache';

interface AttendeeAvatarsProps {
  attendeeIds: string[];
  max?: number;
  size?: 'small' | 'medium' | 'large';
  showNames?: boolean;
}

/**
 * Efficiently displays multiple user avatars using the cache
 *
 * Features:
 * - Single bulk API call for all users
 * - Cached results across the app
 * - Automatic loading state
 *
 * @example
 * <AttendeeAvatars
 *   attendeeIds={['user1', 'user2', 'user3']}
 *   max={5}
 *   size="small"
 * />
 */
export function AttendeeAvatars({
  attendeeIds,
  max = 5,
  size = 'small',
  showNames = false,
}: AttendeeAvatarsProps) {
  const { users, loading } = useUsers(attendeeIds);

  if (loading) {
    return (
      <Stack direction="row" spacing={-1}>
        {Array.from({ length: Math.min(max, attendeeIds.length) }).map(
          (_, i) => (
            <Skeleton
              key={i}
              variant="circular"
              width={size === 'small' ? 32 : size === 'medium' ? 40 : 48}
              height={size === 'small' ? 32 : size === 'medium' ? 40 : 48}
            />
          ),
        )}
      </Stack>
    );
  }

  // Display as compact avatar group
  if (!showNames) {
    return (
      <AvatarGroup
        max={max}
        sx={{
          '& .MuiAvatar-root': {
            width: size === 'small' ? 32 : size === 'medium' ? 40 : 48,
            height: size === 'small' ? 32 : size === 'medium' ? 40 : 48,
            fontSize: size === 'small' ? '0.875rem' : '1rem',
          },
        }}
      >
        {attendeeIds.map((id) => {
          const user = users.get(id);
          return user ? (
            <MuiAvatar key={id} src={user.avatarUrl} alt={user.displayName} />
          ) : (
            <MuiAvatar key={id}>?</MuiAvatar>
          );
        })}
      </AvatarGroup>
    );
  }

  // Display as list with names
  return (
    <Stack spacing={1}>
      {attendeeIds.slice(0, max).map((id) => {
        const user = users.get(id);
        return (
          <Stack key={id} direction="row" spacing={1} alignItems="center">
            <Avatar userId={id} size={size} />
            <Typography variant="body2">
              {user?.displayName || 'Loading...'}
            </Typography>
          </Stack>
        );
      })}
      {attendeeIds.length > max && (
        <Typography variant="caption" color="text.secondary">
          +{attendeeIds.length - max} more
        </Typography>
      )}
    </Stack>
  );
}
