import { getEventsContainer } from '../../../lib/cosmos/cosmos';
import type { EventDocument, EventStageDocument } from '../../../lib/cosmos/cosmos.types';

const EVENT_STAGES: EventStageDocument[] = ['idea', 'picked', 'planned', 'completed'];

function isEventStage(value: string): value is EventStageDocument {
  return EVENT_STAGES.includes(value as EventStageDocument);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const userId = searchParams.get('userId');
  const groupId = searchParams.get('groupId');
  const stage = searchParams.get('stage');


  if (stage && !isEventStage(stage)) {
    return Response.json({ error: 'Invalid stage value' }, { status: 400 });
  }

  try {
    const eventsContainer = getEventsContainer();

    let query = 'SELECT * FROM c WHERE c.type = "event"';
    const parameters: { name: string; value: string }[] = [];

    if (eventId) {
      query += ' AND c.id = @eventId';
      parameters.push({ name: '@eventId', value: eventId });
    }

    // If only userId is provided, return events owned by that user.
    // If groupId is provided (with or without userId), return events in that group.
    if (!eventId && userId && !groupId) {
      query += ' AND c.ownerId = @userId AND (NOT IS_DEFINED(c.ownerType) OR c.ownerType = "user")';
      parameters.push({ name: '@userId', value: userId });
    } else if (!eventId && groupId) {
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
      coverImageUrl: body.coverImageUrl,
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

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Partial<EventDocument>;
    const eventId = body.id?.trim();

    if (!eventId) {
      return Response.json({ error: 'id is required' }, { status: 400 });
    }

    if (body.stage && !isEventStage(body.stage)) {
      return Response.json({ error: 'Invalid stage value' }, { status: 400 });
    }

    if (body.title !== undefined && !body.title.trim()) {
      return Response.json({ error: 'title cannot be empty' }, { status: 400 });
    }

    const eventsContainer = getEventsContainer();

    const { resources: existingEvents } = await eventsContainer.items
      .query<EventDocument>({
        query: 'SELECT * FROM c WHERE c.type = "event" AND c.id = @eventId',
        parameters: [{ name: '@eventId', value: eventId }],
      })
      .fetchAll();

    if (existingEvents.length === 0) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }

    const existingEvent = existingEvents[0];
    const now = new Date().toISOString();

    const updatedEvent: EventDocument = {
      ...existingEvent,
      title: body.title !== undefined ? body.title.trim() : existingEvent.title,
      description: body.description ?? existingEvent.description,
      stage: body.stage ?? existingEvent.stage,
      eventStyle: body.eventStyle ?? existingEvent.eventStyle,
      visibility: body.visibility ?? existingEvent.visibility,
      images: body.images ?? existingEvent.images,
      location: body.location ?? existingEvent.location,
      time: body.time ?? existingEvent.time,
      startTime: body.startTime ?? existingEvent.startTime,
      endTime: body.endTime ?? existingEvent.endTime,
      coverImageUrl: body.coverImageUrl ?? existingEvent.coverImageUrl,
      createdBy: body.createdBy ?? existingEvent.createdBy,
      hostId: body.hostId ?? existingEvent.hostId,
      hostName: body.hostName ?? existingEvent.hostName,
      plannedDate: body.plannedDate ?? existingEvent.plannedDate,
      capacity: body.capacity ?? existingEvent.capacity,
      status: body.status ?? existingEvent.status,
      recurrence: body.recurrence ?? existingEvent.recurrence,
      attendeeCount: body.attendeeCount ?? existingEvent.attendeeCount,
      averageFriendRating:
        body.averageFriendRating ?? existingEvent.averageFriendRating,
      averageCommunityRating:
        body.averageCommunityRating ?? existingEvent.averageCommunityRating,
      updatedAt: now,
    };

    const { resource } = await eventsContainer
      .item(existingEvent.id, existingEvent.partitionKey)
      .replace<EventDocument>(updatedEvent);

    return Response.json(resource ?? updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return Response.json({ error: 'Failed to update event' }, { status: 500 });
  }
}
