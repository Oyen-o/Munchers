import { NextRequest, NextResponse } from 'next/server';

// Mock ratings data
// In production, this would query the database for ratings from:
// - User's friends
// - User's groups
// - Popular community groups

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: placeId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Mock data - replace with actual database queries
    const mockRatings = {
      friends: {
        average: 4.3,
        count: 12,
      },
      userGroups: [
        {
          groupId: 'group1',
          groupName: 'The Johnson Family',
          average: 4.8,
          count: 6,
        },
        {
          groupId: 'group2',
          groupName: 'College Friends',
          average: 4.5,
          count: 15,
        },
        {
          groupId: 'group3',
          groupName: 'Downtown Lunch Crew',
          average: 4.2,
          count: 8,
        },
      ],
      popularGroups: [
        {
          groupId: 'group10',
          groupName: 'Pacific Northwest Food Lovers',
          average: 4.6,
          count: 156,
        },
        {
          groupId: 'group11',
          groupName: 'Seattle Restaurant Explorers',
          average: 4.4,
          count: 98,
        },
        {
          groupId: 'group12',
          groupName: 'University Friends & Alumni',
          average: 4.5,
          count: 82,
        },
        {
          groupId: 'group13',
          groupName: 'Brunch Squad',
          average: 4.7,
          count: 67,
        },
        {
          groupId: 'group14',
          groupName: 'The Chen-Garcia Extended Family',
          average: 4.9,
          count: 58,
        },
        {
          groupId: 'group15',
          groupName: 'Happy Hour Hunters',
          average: 4.1,
          count: 54,
        },
        {
          groupId: 'group16',
          groupName: 'Work Buddies - Tech Bros',
          average: 4.0,
          count: 47,
        },
        {
          groupId: 'group17',
          groupName: 'Coffee Connoisseurs',
          average: 4.3,
          count: 43,
        },
        {
          groupId: 'group18',
          groupName: 'The Martinez Family Circle',
          average: 4.6,
          count: 38,
        },
        {
          groupId: 'group19',
          groupName: 'High School Reunion Squad',
          average: 4.2,
          count: 31,
        },
      ],
    };

    return NextResponse.json(mockRatings);
  } catch (error) {
    console.error('Error fetching place ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: placeId } = await params;
    const body = await request.json();
    const { userId, groupId, rating } = body;

    if (!userId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Mock response - in production, save to database
    const newRating = {
      id: `rating_${Date.now()}`,
      placeId,
      userId,
      groupId,
      rating,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newRating, { status: 201 });
  } catch (error) {
    console.error('Error creating place rating:', error);
    return NextResponse.json(
      { error: 'Failed to create rating' },
      { status: 500 },
    );
  }
}
