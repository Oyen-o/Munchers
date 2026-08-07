import { NextRequest, NextResponse } from 'next/server';
import type { UserAvatarData } from 'src/lib/types/user-cache.types';

/**
 * POST /api/users/bulk
 * 
 * Fetch multiple users by IDs
 * Body: { ids: string[] }
 * Returns: UserAvatarData[]
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: ids array required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database query
    // For now, return mock data for all requested IDs
    const users: UserAvatarData[] = ids.map((id) => ({
      id,
      displayName: `User ${id}`,
      avatarUrl: getDefaultAvatar(id),
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users in bulk:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

/**
 * Get a default avatar based on user ID
 * Cycles through the available avatars
 */
function getDefaultAvatar(userId: string): string {
  const avatars = [
    '/avatars/otter-orange-scarf.png',
    '/avatars/shiba-coffee-cup.png',
    '/avatars/fox-green-jacket.png',
    '/avatars/parrot-green-stick.png',
    '/avatars/rabbit-orange-scarf.png',
  ];

  // Use a simple hash of the userId to consistently assign avatars
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatars[hash % avatars.length];
}
