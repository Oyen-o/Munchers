import { NextRequest, NextResponse } from 'next/server';

// Get plans at a specific place
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: placeId } = await params;

    // Mock plans data - in production, query events where location matches this place
    const mockPlansByPlace: Record<string, any[]> = {
      '1': [
        {
          id: 'plan1',
          title: 'Family Dinner - Mom\'s Birthday',
          placeId,
          createdBy: 'user123',
          creatorName: 'Sarah Johnson',
          groupId: 'group1',
          groupName: 'The Johnson Family',
          plannedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          stage: 'idea',
          attendeeCount: 8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'plan2',
          title: 'Catch Up Brunch',
          placeId,
          createdBy: 'user456',
          creatorName: 'Mike Anderson',
          groupId: 'group2',
          groupName: 'College Friends',
          plannedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          stage: 'idea',
          attendeeCount: 6,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'plan3',
          title: 'Quick Lunch',
          placeId,
          createdBy: 'user789',
          creatorName: 'Emily Rodriguez',
          groupId: null,
          groupName: null,
          plannedDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          stage: 'idea',
          attendeeCount: 2,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'plan4',
          title: 'Team Celebration Dinner',
          placeId,
          createdBy: 'user555',
          creatorName: 'David Park',
          groupId: 'group16',
          groupName: 'Work Buddies - Tech Bros',
          plannedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          stage: 'idea',
          attendeeCount: 12,
          createdAt: new Date().toISOString(),
        },
      ],
      '2': [
        {
          id: 'plan5',
          title: 'Power Sand Summer Tournament',
          placeId,
          createdBy: 'user101',
          creatorName: 'Power Sand Volleyball Club',
          groupId: 'group20',
          groupName: 'Power Sand Volleyball Club',
          plannedDate: (() => {
            const date = new Date();
            const daysUntilSaturday = (6 - date.getDay() + 7) % 7 || 7;
            date.setDate(date.getDate() + daysUntilSaturday);
            date.setHours(9, 0, 0, 0);
            return date.toISOString();
          })(),
          stage: 'planned',
          attendeeCount: 42,
          description: 'Competitive doubles tournament hosted by Power Volleyball. Multiple divisions with pool play followed by a single elimination bracket.',
          coverImageUrl: 'https://static.wixstatic.com/media/d17c5e_e6b296f31dc248fa88cdc4ae25400d73~mv2.png',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'plan6',
          title: 'Tuesday Night Pickup Volleyball',
          placeId,
          createdBy: 'community',
          creatorName: 'Community',
          groupId: null,
          groupName: null,
          plannedDate: (() => {
            const date = new Date();
            const daysUntilTuesday = (2 - date.getDay() + 7) % 7 || 7;
            date.setDate(date.getDate() + daysUntilTuesday);
            date.setHours(18, 30, 0, 0);
            return date.toISOString();
          })(),
          stage: 'idea',
          attendeeCount: 18,
          description: 'Casual pickup volleyball. Rotate teams after every game. Players of all skill levels welcome.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'plan7',
          title: 'Sunset Open Play',
          placeId,
          createdBy: 'user202',
          creatorName: 'Scottsdale Volleyball',
          groupId: 'group21',
          groupName: 'Scottsdale Volleyball',
          plannedDate: (() => {
            const date = new Date();
            const daysUntilFriday = (5 - date.getDay() + 7) % 7 || 7;
            date.setDate(date.getDate() + daysUntilFriday);
            date.setHours(19, 0, 0, 0);
            return date.toISOString();
          })(),
          stage: 'planned',
          attendeeCount: 26,
          description: 'Open courts until sunset with rotating pickup games.',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    const mockPlans = mockPlansByPlace[placeId] || mockPlansByPlace['1'];

    return NextResponse.json(mockPlans);
  } catch (error) {
    console.error('Error fetching place plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 },
    );
  }
}

// Create a new plan at this place
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: placeId } = await params;
    const body = await request.json();
    const { title, userId, groupId, plannedDate } = body;

    if (!title || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Mock response - in production, create event in database
    const newPlan = {
      id: `plan_${Date.now()}`,
      title,
      placeId,
      createdBy: userId,
      groupId: groupId || null,
      plannedDate: plannedDate || null,
      stage: 'idea',
      attendeeCount: 1,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 },
    );
  }
}
