'use client';

import type { CachedUser, UserAvatarData } from '../types/user-cache.types';

/**
 * Client-side user cache service for avatar and profile data
 * 
 * Features:
 * - In-memory cache with Map for O(1) lookups
 * - Optional localStorage persistence across page refreshes
 * - Request de-duplication to prevent duplicate network calls
 * - Bulk fetching for efficiency
 * - Cache invalidation support
 * 
 * NOTE: This is a client-side only service. The 'use client' directive ensures
 * it only runs in the browser, not during server-side rendering.
 */
class UserCacheService {
  private cache: Map<string, CachedUser>;
  private inFlightRequests: Map<string, Promise<CachedUser | null>>;
  private readonly STORAGE_KEY = 'user-cache';
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  constructor() {
    this.cache = new Map();
    this.inFlightRequests = new Map();
    this.loadFromLocalStorage();
  }

  /**
   * Get a single user by ID
   * Returns cached data immediately or fetches from API
   */
  async getUser(userId: string): Promise<CachedUser | null> {
    // Check cache first
    const cached = this.cache.get(userId);
    if (cached && this.isCacheValid(cached)) {
      return cached;
    }

    // Check if request is already in flight
    const inFlight = this.inFlightRequests.get(userId);
    if (inFlight) {
      return inFlight;
    }

    // Create new request
    const request = this.fetchUser(userId);
    this.inFlightRequests.set(userId, request);

    try {
      const user = await request;
      return user;
    } finally {
      this.inFlightRequests.delete(userId);
    }
  }

  /**
   * Get multiple users by IDs
   * Returns cached users immediately and fetches only missing ones
   */
  async getUsers(userIds: string[]): Promise<Map<string, CachedUser>> {
    const results = new Map<string, CachedUser>();
    const missingIds: string[] = [];

    // Collect cached users and identify missing ones
    for (const userId of userIds) {
      const cached = this.cache.get(userId);
      if (cached && this.isCacheValid(cached)) {
        results.set(userId, cached);
      } else {
        missingIds.push(userId);
      }
    }

    // Fetch missing users in bulk
    if (missingIds.length > 0) {
      const fetched = await this.fetchUsersBulk(missingIds);
      fetched.forEach((user) => {
        results.set(user.id, user);
      });
    }

    return results;
  }

  /**
   * Invalidate a specific user's cache entry
   */
  invalidateUser(userId: string): void {
    this.cache.delete(userId);
    this.saveToLocalStorage();
  }

  /**
   * Clear the entire cache
   */
  clearCache(): void {
    this.cache.clear();
    this.inFlightRequests.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Preload users into cache
   */
  preloadUsers(users: UserAvatarData[]): void {
    users.forEach((user) => {
      const cachedUser: CachedUser = {
        id: user.id,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        updatedAt: Date.now(),
      };
      this.cache.set(user.id, cachedUser);
    });
    this.saveToLocalStorage();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      inFlightRequests: this.inFlightRequests.size,
    };
  }

  // Private methods

  private async fetchUser(userId: string): Promise<CachedUser | null> {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        console.error(`Failed to fetch user ${userId}:`, response.statusText);
        return null;
      }

      const data: UserAvatarData = await response.json();
      const cachedUser: CachedUser = {
        id: data.id,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        updatedAt: Date.now(),
      };

      this.cache.set(userId, cachedUser);
      this.saveToLocalStorage();

      return cachedUser;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      return null;
    }
  }

  private async fetchUsersBulk(userIds: string[]): Promise<CachedUser[]> {
    try {
      const response = await fetch('/api/users/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: userIds }),
      });

      if (!response.ok) {
        console.error('Failed to fetch users in bulk:', response.statusText);
        return [];
      }

      const data: UserAvatarData[] = await response.json();
      console.log('Fetched users in bulk:', data);
      const cachedUsers: CachedUser[] = data.map((user) => ({
        id: user.id,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        updatedAt: Date.now(),
      }));

      // Store in cache
      cachedUsers.forEach((user) => {
        this.cache.set(user.id, user);
      });
      this.saveToLocalStorage();

      return cachedUsers;
    } catch (error) {
      console.error('Error fetching users in bulk:', error);
      return [];
    }
  }

  private isCacheValid(cached: CachedUser): boolean {
    return Date.now() - cached.updatedAt < this.CACHE_DURATION;
  }

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      console.log('Loading user cache from localStorage:', stored);
      if (stored) {
        const data = JSON.parse(stored) as Array<[string, CachedUser]>;
        this.cache = new Map(data);

        // Remove expired entries
        for (const [userId, user] of this.cache) {
          if (!this.isCacheValid(user)) {
            this.cache.delete(userId);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user cache from localStorage:', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
        console.log('Saving user cache to localStorage:', this.cache);
      const data = Array.from(this.cache.entries());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user cache to localStorage:', error);
    }
  }
}

/**
 * Singleton instance - CLIENT-SIDE ONLY
 * 
 * Because of 'use client' directive, this instance only exists in the browser.
 * All components share this single instance, providing:
 * - One shared cache across the entire React app
 * - Request de-duplication across components
 * - Persistent cache via localStorage
 * 
 * In Next.js:
 * - Server (SSR): This module is not instantiated
 * - Client (Browser): One singleton instance per browser tab/session
 */
export const userCacheService = new UserCacheService();
