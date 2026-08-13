'use client';

import { Avatar, Stack, Tooltip, Typography } from '@mui/material';
import './facepile.scss';

type FacepileUser = {
  id: string;
  name: string;
  avatar: string;
  rating?: number;
};

type FacepileProps = {
  users: FacepileUser[];
  max?: number;
  size?: 'small' | 'medium' | 'large';
};

export function Facepile({ users, max = 5, size = 'medium' }: FacepileProps) {
  const displayUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  const sizeMap = {
    small: 28,
    medium: 36,
    large: 48,
  };

  const avatarSize = sizeMap[size];

  return (
    <Stack direction="row" className="facepile" spacing={-1}>
      {displayUsers.map((user) => (
        <Tooltip
          key={user.id}
          title={
            user.rating
              ? `${user.name} rated ${user.rating}/5`
              : user.name
          }
          arrow
        >
          <Avatar
            src={user.avatar}
            alt={user.name}
            className="facepile__avatar"
            sx={{
              width: avatarSize,
              height: avatarSize,
              border: '2px solid white',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                zIndex: 10,
              },
            }}
          />
        </Tooltip>
      ))}
      {remainingCount > 0 && (
        <Tooltip
          title={`${remainingCount} more ${remainingCount === 1 ? 'friend' : 'friends'}`}
          arrow
        >
          <Avatar
            className="facepile__avatar facepile__avatar--overflow"
            sx={{
              width: avatarSize,
              height: avatarSize,
              border: '2px solid white',
              bgcolor: 'var(--color-text-secondary)',
              fontSize: size === 'small' ? '0.75rem' : '0.875rem',
              fontWeight: 600,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              +{remainingCount}
            </Typography>
          </Avatar>
        </Tooltip>
      )}
    </Stack>
  );
}
