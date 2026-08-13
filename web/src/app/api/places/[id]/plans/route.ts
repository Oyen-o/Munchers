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
          experienceId: 'exp-tasting-menu',
          experienceTitle: 'Chef\'s Tasting Menu',
          experienceImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop',
          experienceCategory: 'Fine Dining',
          createdBy: 'user123',
          creatorName: 'Sarah Johnson',
          creatorAvatar: 'https://i.pravatar.cc/150?img=5',
          groupId: 'group1',
          groupName: 'The Johnson Family',
          groupAvatar: 'https://i.pravatar.cc/150?img=70',
          groupMemberCount: 12,
          plannedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'upcoming',
          stage: 'planned',
          attendeeCount: 8,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'plan2',
          title: 'Catch Up Brunch',
          placeId,
          experienceId: 'exp-brunch',
          experienceTitle: 'Student Discounts',
          experienceImage: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=400&h=200&fit=crop',
          experienceCategory: 'Brunch',
          createdBy: 'user456',
          creatorName: 'Mike Anderson',
          creatorAvatar: 'https://i.pravatar.cc/150?img=12',
          groupId: 'group2',
          groupName: 'College Friends',
          groupAvatar: 'https://i.pravatar.cc/150?img=71',
          groupMemberCount: 18,
          plannedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'planning',
          stage: 'planning',
          attendeeCount: 6,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'plan3',
          title: 'Try after hiking',
          placeId,
          experienceId: 'exp-brunch',
          experienceTitle: 'Weekend Brunch',
          experienceImage: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=400&h=200&fit=crop',
          experienceCategory: 'Brunch',
          createdBy: 'user789',
          creatorName: 'Emily Rodriguez',
          creatorAvatar: 'https://i.pravatar.cc/150?img=9',
          groupId: null,
          groupName: null,
          groupAvatar: null,
          groupMemberCount: null,
          plannedDate: null,
          status: 'idea',
          stage: 'idea',
          attendeeCount: 1,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'plan4',
          title: 'Team Celebration Dinner',
          placeId,
          experienceId: 'exp-cocktails',
          experienceTitle: 'Craft Cocktail Experience',
          experienceImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=200&fit=crop',
          experienceCategory: 'Happy Hour',
          createdBy: 'user555',
          creatorName: 'David Park',
          creatorAvatar: 'https://i.pravatar.cc/150?img=15',
          groupId: 'group16',
          groupName: 'Work Buddies',
          groupAvatar: 'https://i.pravatar.cc/150?img=72',
          groupMemberCount: 24,
          plannedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'planning',
          stage: 'planning',
          attendeeCount: 12,
          createdAt: new Date().toISOString(),
        },
      ],
      '2': [
        {
          id: 'plan5',
          title: 'Sunday Volleyball Meetup',
          placeId,
          experienceId: 'exp3',
          experienceTitle: 'Beginner Open Play',
          experienceImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ322ZFapAQFmkj8q1G1xRNGpiC1NwVw-bEKSsU1G9QUA&s=612x612',
          experienceCategory: 'Learning',
          createdBy: 'user101',
          creatorName: 'Chris Martinez',
          creatorAvatar: 'https://i.pravatar.cc/150?img=13',
          groupId: 'group20',
          groupName: 'Power Sand Volleyball Club',
          groupAvatar: 'https://i.pravatar.cc/150?img=73',
          groupMemberCount: 247,
          plannedDate: (() => {
            const date = new Date();
            const daysUntilSunday = (7 - date.getDay()) % 7 || 7;
            date.setDate(date.getDate() + daysUntilSunday);
            date.setHours(9, 0, 0, 0);
            return date.toISOString();
          })(),
          status: 'upcoming',
          stage: 'planned',
          attendeeCount: 24,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'plan6',
          title: 'Want to try this spot',
          placeId,
          experienceId: 'exp4',
          experienceTitle: 'Friday Sunset Games',
          experienceImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Jm5scD1doXer_wA8Io_y9gtuoc0bPI5E0-XhulPqfQ&s=10',
          experienceCategory: 'Social',
          createdBy: 'user456',
          creatorName: 'Alex Chen',
          creatorAvatar: 'https://i.pravatar.cc/150?img=20',
          groupId: null,
          groupName: null,
          groupAvatar: null,
          groupMemberCount: null,
          plannedDate: null,
          status: 'idea',
          stage: 'idea',
          attendeeCount: 1,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'plan7',
          title: 'Weekly practice session',
          placeId,
          experienceId: 'exp1',
          experienceTitle: 'Morning Volleyball Meetup',
          experienceImage: 'https://media.istockphoto.com/id/1217070875/photo/silhouette-of-beach-volleyball-player-on-the-beach.jpg?s=612x612&w=0&k=20&c=pp32lsImCnMZoHvcbQnOmzWrYg_-gHNKIrEkwlc9agw=',
          experienceCategory: 'Meetup',
          createdBy: 'user202',
          creatorName: 'Jordan Lee',
          creatorAvatar: 'https://i.pravatar.cc/150?img=24',
          groupId: 'group21',
          groupName: 'Scottsdale Volleyball',
          groupAvatar: 'https://i.pravatar.cc/150?img=74',
          groupMemberCount: 156,
          plannedDate: (() => {
            const date = new Date();
            const daysUntilSaturday = (6 - date.getDay() + 7) % 7 || 7;
            date.setDate(date.getDate() + daysUntilSaturday);
            date.setHours(8, 0, 0, 0);
            return date.toISOString();
          })(),
          status: 'upcoming',
          stage: 'planned',
          attendeeCount: 15,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'plan8',
          title: 'Monthly Sushi Night',
          placeId,
          experienceId: 'exp2',
          experienceTitle: 'Tournament Weekend',
          experienceImage: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=250&fit=crop',
          experienceCategory: 'Competition',
          createdBy: 'user303',
          creatorName: 'Sarah Kim',
          creatorAvatar: 'https://i.pravatar.cc/150?img=26',
          groupId: 'group22',
          groupName: 'Phoenix Sports Club',
          groupAvatar: 'https://i.pravatar.cc/150?img=75',
          groupMemberCount: 189,
          plannedDate: (() => {
            const date = new Date();
            date.setDate(date.getDate() + 14);
            date.setHours(10, 0, 0, 0);
            return date.toISOString();
          })(),
          status: 'planning',
          stage: 'planning',
          attendeeCount: 32,
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
