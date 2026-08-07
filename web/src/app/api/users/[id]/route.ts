import { NextRequest, NextResponse } from 'next/server';
import type { UserAvatarData } from 'src/lib/types/user-cache.types';

/**
 * GET /api/users/[id]
 * 
 * Returns lightweight user data for avatar display
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Replace with actual database query
    // For now, return mock data based on the seed data pattern
    const mockUser: UserAvatarData = {
      id,
      displayName: `User ${id}`,
      avatarUrl: getDefaultAvatar(id),
    };

    return NextResponse.json(mockUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
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
