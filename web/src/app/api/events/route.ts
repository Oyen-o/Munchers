export const dynamic = 'force-static';
export const revalidate = false;

import { getEventsContainer } from '../../../lib/cosmos/cosmos';
import type { EventDocument, EventStageDocument } from '../../../lib/cosmos/cosmos.types';

const EVENT_STAGES: EventStageDocument[] = ['idea', 'picked', 'planned'];

function isEventStage(value: string): value is EventStageDocument {
  return EVENT_STAGES.includes(value as EventStageDocument);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const groupId = searchParams.get('groupId');
  const stage = searchParams.get('stage');

  if (!userId && !groupId) {
    return Response.json({ error: 'userId or groupId is required' }, { status: 400 });
  }

  if (stage && !isEventStage(stage)) {
    return Response.json({ error: 'Invalid stage value' }, { status: 400 });
  }

  try {
    const eventsContainer = getEventsContainer();

    let query = 'SELECT * FROM c WHERE c.type = "event"';
    const parameters: { name: string; value: string }[] = [];

    if (userId) {
      query += ' AND c.ownerId = @userId AND (NOT IS_DEFINED(c.ownerType) OR c.ownerType = "user")';
      parameters.push({ name: '@userId', value: userId });
    }

    if (groupId) {
      query += ' AND c.groupId = @groupId';
      parameters.push({ name: '@groupId', value: groupId });
    }

    if (stage) {
      query += ' AND c.stage = @stage';
      parameters.push({ name: '@stage', value: stage });
    }

    const { resources } = await eventsContainer.items
      .query<EventDocument>({ query, parameters })
      .fetchAll();

    return Response.json(resources);
  } catch (error) {
    console.error('Error fetching events:', error);
    return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<EventDocument>;

    if (!body.title || !body.ownerId) {
      return Response.json({ error: 'title and ownerId are required' }, { status: 400 });
    }

    const ownerType = body.ownerType ?? (body.groupId ? 'group' : 'user');

    if (body.stage && !isEventStage(body.stage)) {
      return Response.json({ error: 'Invalid stage value' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const eventsContainer = getEventsContainer();
    const trimmedOwnerId = body.ownerId.trim();
    const partitionKey = body.partitionKey?.trim() || `owner_${trimmedOwnerId}`;

    const event: EventDocument = {
      id: body.id?.trim() || `event_${Date.now()}`,
      type: 'event',
      partitionKey,
      ownerId: trimmedOwnerId,
      ownerType,
      groupId: ownerType === 'group' ? body.groupId ?? trimmedOwnerId : body.groupId ?? null,
      title: body.title.trim(),
      description: body.description,
      stage: body.stage ?? 'idea',
      eventStyle: body.eventStyle,
      visibility: body.visibility,
      images: body.images,
      location: body.location,
      time: body.time,
      startTime: body.startTime,
      endTime: body.endTime,
      imageUrl: body.imageUrl,
      createdBy: body.createdBy,
      hostId: body.hostId,
      hostName: body.hostName,
      plannedDate: body.plannedDate,
      capacity: body.capacity,
      status: body.status,
      recurrence: body.recurrence,
      attendeeCount: body.attendeeCount,
      averageFriendRating: body.averageFriendRating,
      averageCommunityRating: body.averageCommunityRating,
      createdAt: now,
      updatedAt: now,
    };

    const { resource } = await eventsContainer.items.create<EventDocument>(event);
    return Response.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return Response.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
