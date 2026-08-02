import {
  getGroupsContainer,
  getMembershipsContainer,
  getUsersContainer,
} from '../../../../lib/cosmos/cosmos';
import type {
  GroupDocument,
  MembershipDocument,
  UserDocument,
} from '../../../../lib/cosmos/cosmos.types';

type GroupMemberProfile = {
  userId: string;
  role: 'admin' | 'member';
  displayName: string;
  avatarUrl: string;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: groupId } = await params;

  if (!groupId?.trim()) {
    return Response.json({ error: 'group id is required' }, { status: 400 });
  }

  try {
    const groupsContainer = getGroupsContainer();
    const membershipsContainer = getMembershipsContainer();
    const usersContainer = getUsersContainer();

    const { resource: group } = await groupsContainer
      .item(groupId, groupId)
      .read<GroupDocument>();

    if (!group) {
      return Response.json({ error: 'Group not found' }, { status: 404 });
    }

    const { resources: memberships } = await membershipsContainer.items
      .query<MembershipDocument>({
        query: 'SELECT * FROM c WHERE c.groupId = @groupId',
        parameters: [{ name: '@groupId', value: groupId }],
      })
      .fetchAll();

    const uniqueUserIds = [...new Set(memberships.map((membership) => membership.userId))];

    let users: UserDocument[] = [];

    if (uniqueUserIds.length > 0) {
      const { resources } = await usersContainer.items
        .query<UserDocument>({
          query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(@userIds, c.id)',
          parameters: [{ name: '@userIds', value: uniqueUserIds }],
        })
        .fetchAll();

      users = resources;
    }

    const memberById = new Map(users.map((user) => [user.id, user]));

    const members: GroupMemberProfile[] = memberships.map((membership) => {
      const user = memberById.get(membership.userId);

      return {
        userId: membership.userId,
        role: membership.role,
        displayName: user?.displayName ?? user?.username ?? membership.userId,
        avatarUrl:
          user?.profileImage ??
          '/avatars/avatar_0.png',
      };
    });

    return Response.json({ group, members });
  } catch (error) {
    console.error('Error fetching group details:', error);
    return Response.json({ error: 'Failed to fetch group details' }, { status: 500 });
  }
}
