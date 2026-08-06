import { NextRequest, NextResponse } from 'next/server';

// Get plans at a specific place
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id: placeId } = params;

    // Mock plans data - in production, query events where location matches this place
    const mockPlans = [
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
    ];

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
  { params }: { params: { id: string } },
) {
  try {
    const { id: placeId } = params;
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
