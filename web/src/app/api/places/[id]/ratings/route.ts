import { NextRequest, NextResponse } from 'next/server';

// Mock ratings data for friends
// Mock lists data for groups
// In production, this would query the database for:
// - Ratings from user's friends (ratings)
// - Group lists that include this place (ranked lists)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: placeId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Mock data - replace with actual database queries
    const mockDataByPlace: Record<string, any> = {
      '1': {
        ratings: {
          friends: {
            average: 4.3,
            count: 12,
          },
        },
        lists: {
          userGroupLists: [
            {
              listId: 'list1',
              listName: 'Best Pizza',
              groupId: 'group1',
              groupName: 'The Johnson Family',
              rank: 3,
              totalItems: 12,
            },
            {
              listId: 'list2',
              listName: 'Casual Dining',
              groupId: 'group2',
              groupName: 'College Friends',
              rank: 1,
              totalItems: 8,
            },
            {
              listId: 'list3',
              listName: 'Quick Lunch Spots',
              groupId: 'group3',
              groupName: 'Downtown Lunch Crew',
              rank: 5,
              totalItems: 15,
            },
          ],
          popularGroupLists: [
            {
              listId: 'list10',
              listName: 'Top Italian Restaurants',
              groupId: 'group10',
              groupName: 'Pacific Northwest Food Lovers',
              rank: 12,
              totalItems: 45,
            },
            {
              listId: 'list11',
              listName: 'Best Pizza in Seattle',
              groupId: 'group11',
              groupName: 'Seattle Restaurant Explorers',
              rank: 8,
              totalItems: 30,
            },
            {
              listId: 'list12',
              listName: 'Date Night Spots',
              groupId: 'group12',
              groupName: 'University Friends & Alumni',
              rank: 15,
              totalItems: 25,
            },
            {
              listId: 'list13',
              listName: 'Weekend Brunch',
              groupId: 'group13',
              groupName: 'Brunch Squad',
              rank: 2,
              totalItems: 18,
            },
            {
              listId: 'list14',
              listName: 'Family Favorites',
              groupId: 'group14',
              groupName: 'The Chen-Garcia Extended Family',
              rank: 1,
              totalItems: 10,
            },
            {
              listId: 'list15',
              listName: 'After Work Drinks',
              groupId: 'group15',
              groupName: 'Happy Hour Hunters',
              rank: 7,
              totalItems: 22,
            },
            {
              listId: 'list16',
              listName: 'Team Lunch Spots',
              groupId: 'group16',
              groupName: 'Work Buddies - Tech Bros',
              rank: 4,
              totalItems: 20,
            },
            {
              listId: 'list17',
              listName: 'Coffee & Breakfast',
              groupId: 'group17',
              groupName: 'Coffee Connoisseurs',
              rank: 11,
              totalItems: 35,
            },
            {
              listId: 'list18',
              listName: 'Special Occasions',
              groupId: 'group18',
              groupName: 'The Martinez Family Circle',
              rank: 6,
              totalItems: 14,
            },
            {
              listId: 'list19',
              listName: 'Nostalgia Eats',
              groupId: 'group19',
              groupName: 'High School Reunion Squad',
              rank: 9,
              totalItems: 16,
            },
          ],
        },
      },
      '2': {
        ratings: {
          friends: {
            average: 4.8,
            count: 28,
          },
        },
        lists: {
          userGroupLists: [
            {
              listId: 'list20',
              listName: 'Best Volleyball Courts',
              groupId: 'group20',
              groupName: 'AZ Sand Volleyball Players',
              rank: 2,
              totalItems: 214,
            },
            {
              listId: 'list21',
              listName: 'Weekly Volleyball Spots',
              groupId: 'group21',
              groupName: 'Scottsdale Volleyball',
              rank: 1,
              totalItems: 176,
            },
            {
              listId: 'list22',
              listName: 'Tournament Locations',
              groupId: 'group22',
              groupName: 'East Valley Volleyball',
              rank: 3,
              totalItems: 102,
            },
          ],
          popularGroupLists: [
            {
              listId: 'list23',
              listName: 'Top Volleyball Courts',
              groupId: 'group20',
              groupName: 'Power Sand Volleyball Club',
              rank: 2,
              totalItems: 214,
            },
            {
              listId: 'list24',
              listName: 'Outdoor Courts',
              groupId: 'group21',
              groupName: 'Scottsdale Volleyball',
              rank: 1,
              totalItems: 176,
            },
            {
              listId: 'list25',
              listName: 'Tournament Venues',
              groupId: 'group22',
              groupName: 'East Valley Volleyball',
              rank: 4,
              totalItems: 102,
            },
            {
              listId: 'list26',
              listName: 'Best Sand Courts',
              groupId: 'group23',
              groupName: 'ASU Volleyball Alumni',
              rank: 1,
              totalItems: 67,
            },
            {
              listId: 'list27',
              listName: 'Weekly Pickup Spots',
              groupId: 'group24',
              groupName: 'Friday Night Volleyball',
              rank: 2,
              totalItems: 49,
            },
            {
              listId: 'list28',
              listName: 'League Locations',
              groupId: 'group25',
              groupName: 'Phoenix Volleyball League',
              rank: 3,
              totalItems: 89,
            },
            {
              listId: 'list29',
              listName: 'Community Courts',
              groupId: 'group26',
              groupName: 'Arizona Beach Volleyball',
              rank: 5,
              totalItems: 124,
            },
            {
              listId: 'list30',
              listName: 'Training Spots',
              groupId: 'group27',
              groupName: 'Desert Volleyball Academy',
              rank: 1,
              totalItems: 43,
            },
            {
              listId: 'list31',
              listName: 'Competitive Venues',
              groupId: 'group28',
              groupName: 'Arizona Volleyball Network',
              rank: 6,
              totalItems: 156,
            },
            {
              listId: 'list32',
              listName: 'Sunday Morning Courts',
              groupId: 'group29',
              groupName: 'Weekend Warriors Volleyball',
              rank: 2,
              totalItems: 78,
            },
          ],
        },
      },
    };

    const mockData = mockDataByPlace[placeId] || mockDataByPlace['1'];

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching place data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
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
    const { userId, rating } = body;

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
