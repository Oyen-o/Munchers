/**
 * Cached user data for avatar display
 */
export interface CachedUser {
  id: string;
  displayName: string;
  avatarUrl: string;
  updatedAt: number;
}

/**
 * Lightweight user data returned by API
 */
export interface UserAvatarData {
  id: string;
  displayName: string;
  avatarUrl: string;
}
