
import { getGroupsContainer, getMembershipsContainer } from '../../../lib/cosmos/cosmos';
import type { GroupDocument, MembershipDocument } from '../../../lib/cosmos/cosmos.types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');  

  if (!userId) {
    return Response.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const membershipsContainer = getMembershipsContainer();
    const groupsContainer = getGroupsContainer();

    const { resources: memberships } = await membershipsContainer.items
      .query<MembershipDocument>({
        query: 'SELECT * FROM c WHERE c.userId = @userId',
        parameters: [{ name: '@userId', value: userId }],
      })
      .fetchAll();

      console.log('Memberships:', memberships);
    const groupIds = [...new Set(memberships.map((membership) => membership.groupId))];

    if (groupIds.length === 0) {
      return Response.json([]);
    }

    const { resources: groups } = await groupsContainer.items
      .query<GroupDocument>({
        query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(@groupIds, c.id)',
        parameters: [{ name: '@groupIds', value: groupIds }],
      })
      .fetchAll();

    return Response.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return Response.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GroupDocument> & { createdBy?: string };

    if (!body.name || !body.createdBy) {
      return Response.json({ error: 'name and createdBy are required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const membershipsContainer = getMembershipsContainer();
    const groupsContainer = getGroupsContainer();
    const createdBy = body.createdBy.trim();
    const groupId = body.id?.trim() || `group_${Date.now()}`;

    const group: GroupDocument = {
      id: groupId,
      type: 'community',
      name: body.name.trim(),
      description: body.description ?? '',
      visibility: body.visibility,
      ownerId: body.ownerId?.trim() || createdBy,
      image: body.image,
      stats: {
        memberCount: 1,
        eventCount: 0,
      },
      createdAt: now,
      updatedAt: now,
    };

    const membership: MembershipDocument = {
      id: `${groupId}_${createdBy}`,
      type: 'membership',
      groupId,
      userId: createdBy,
      role: 'admin',
      joinedAt: now,
    };

    const { resource: groupResource } = await groupsContainer.items.create<GroupDocument>(group);
    await membershipsContainer.items.create<MembershipDocument>(membership);

    return Response.json(groupResource, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return Response.json({ error: 'Failed to create group' }, { status: 500 });
  }
}
