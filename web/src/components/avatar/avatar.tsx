'use client';

import { Box, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { userCacheService } from 'src/lib/services/user-cache-service';
import type { CachedUser } from 'src/lib/types/user-cache.types';

type Size = 'small' | 'medium' | 'large';

interface AvatarProps {
  // New primary API: just pass userId
  userId?: string;
  // Legacy support: direct src/alt props
  src?: string;
  alt?: string;
  size?: Size;
  // Deprecated
  user?: any;
}

/**
 * Avatar component with integrated caching
 *
 * Usage:
 * <Avatar userId="123" size="medium" />
 *
 * Or legacy mode:
 * <Avatar src="/path/to/image.png" alt="User Name" size="medium" />
 */
export function Avatar({
  userId,
  src,
  alt,
  size = 'medium',
  user,
}: AvatarProps) {
  const [cachedUser, setCachedUser] = useState<CachedUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      userCacheService
        .getUser(userId)
        .then((user) => {
          setCachedUser(user);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  const border =
    size === 'small'
      ? '1px solid var(--color-accent-main)'
      : size === 'medium'
        ? '2px solid var(--color-accent-main)'
        : '3px solid var(--color-accent-main)';
  const dimensions = size === 'small' ? 25 : size === 'medium' ? 45 : 55;

  // Determine image source and alt text
  const imageSrc =
    userId && cachedUser
      ? cachedUser.avatarUrl
      : src || '/avatars/avatar_0.png';
  const imageAlt =
    userId && cachedUser ? cachedUser.displayName : alt || 'Avatar';

  // Show loading state
  if (loading && userId) {
    return (
      <Skeleton
        variant="circular"
        width={dimensions}
        height={dimensions}
        sx={{ border }}
      />
    );
  }

  // If no image available, show initials
  if (!imageSrc || imageSrc === '/avatars/avatar_0.png') {
    const initials = getInitials(imageAlt);
    return (
      <Box
        sx={{
          border,
          cursor: 'pointer',
          borderRadius: '50%',
          height: dimensions,
          width: dimensions,
          backgroundColor: 'var(--color-accent-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize:
            size === 'small' ? '10px' : size === 'medium' ? '16px' : '20px',
        }}
      >
        {initials}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        border,
        cursor: 'pointer',
        borderRadius: '50%',
        height: dimensions,
        width: dimensions,
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      title={imageAlt}
    />
  );
}

/**
 * Extract initials from a name
 */
function getInitials(name: string): string {
  if (!name) return '?';

  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
