import { getCommentsContainer } from '../../../lib/cosmos/cosmos';
import type { CommentDocument } from '../../../lib/cosmos/cosmos.types';

function normalizeComment(document: CommentDocument): CommentDocument {
  return {
    ...document,
    type: 'comment',
    updatedAt: document.updatedAt ?? document.createdAt,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId')?.trim();
  const groupId = searchParams.get('groupId')?.trim();

  if (!eventId && !groupId) {
    return Response.json(
      { error: 'eventId or groupId is required' },
      { status: 400 },
    );
  }

  try {
    const commentsContainer = getCommentsContainer();
    let query = 'SELECT * FROM c WHERE c.type = "comment"';
    const parameters: { name: string; value: string }[] = [];

    if (eventId) {
      query += ' AND c.eventId = @eventId';
      parameters.push({ name: '@eventId', value: eventId });
    }

    if (groupId) {
      query += ' AND c.groupId = @groupId';
      parameters.push({ name: '@groupId', value: groupId });
    }

    query += ' ORDER BY c.createdAt DESC';

    const { resources } = await commentsContainer.items
      .query<CommentDocument>({ query, parameters })
      .fetchAll();

    return Response.json(resources.map(normalizeComment));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return Response.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CommentDocument>;
    const eventId = body.eventId?.trim();
    const groupId = body.groupId?.trim();
    const userId = body.userId?.trim();
    const content = body.content?.trim();

    if (!eventId && !groupId) {
      return Response.json(
        { error: 'eventId or groupId is required' },
        { status: 400 },
      );
    }

    if (!userId || !content) {
      return Response.json(
        { error: 'userId and content are required' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();

    const newComment: CommentDocument = {
      id: `comment_${Date.now()}`,
      type: 'comment',
      eventId,
      groupId,
      userId,
      content,
      createdAt: now,
      updatedAt: now,
    };

    const commentsContainer = getCommentsContainer();
    const { resource } = await commentsContainer.items.create<CommentDocument>(
      newComment,
    );

    return Response.json(resource ? normalizeComment(resource) : newComment, {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return Response.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
