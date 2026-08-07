'use client';

import { useEffect, useState } from 'react';
import { userCacheService } from '../services/user-cache-service';
import type { CachedUser } from '../types/user-cache.types';

/**
 * React hook to fetch a single user from cache
 * 
 * @example
 * const { user, loading, error } = useUser(userId);
 */
export function useUser(userId: string | undefined) {
  const [user, setUser] = useState<CachedUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    userCacheService
      .getUser(userId)
      .then((cachedUser) => {
        setUser(cachedUser);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);

  return { user, loading, error };
}

/**
 * React hook to fetch multiple users from cache
 * 
 * @example
 * const { users, loading, error } = useUsers(['user1', 'user2', 'user3']);
 */
export function useUsers(userIds: string[] | undefined) {
  const [users, setUsers] = useState<Map<string, CachedUser>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userIds || userIds.length === 0) {
      setUsers(new Map());
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    userCacheService
      .getUsers(userIds)
      .then((cachedUsers) => {
        setUsers(cachedUsers);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [userIds?.join(',')]);

  return { users, loading, error };
}

/**
 * Hook to invalidate cache entries
 * 
 * @example
 * const { invalidateUser, clearCache } = useUserCacheControl();
 */
export function useUserCacheControl() {
  const invalidateUser = (userId: string) => {
    userCacheService.invalidateUser(userId);
  };

  const clearCache = () => {
    userCacheService.clearCache();
  };

  return { invalidateUser, clearCache };
}
