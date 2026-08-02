import type { EventAvailabilityDocument } from '../../../lib/cosmos/cosmos.types';
import {
  getEventAvailabilityForUser,
  upsertEventAvailabilityForUser,
} from '../../../lib/services/event-availability-service';

function normalizeAvailability(
  document: EventAvailabilityDocument,
): EventAvailabilityDocument {
  return {
    ...document,
    type: 'eventAvailability',
    slots: Array.isArray(document.slots) ? document.slots : [],
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId')?.trim();
  const userId = searchParams.get('userId')?.trim();

  if (!eventId || !userId) {
    return Response.json(
      { error: 'eventId and userId are required' },
      { status: 400 },
    );
  }

  try {
    const resource = await getEventAvailabilityForUser(eventId, userId);

    if (!resource) {
      return Response.json({
        id: `${eventId}_${userId}`,
        type: 'eventAvailability',
        eventId,
        userId,
        slots: [],
        updatedAt: new Date(0).toISOString(),
      });
    }

    return Response.json(normalizeAvailability(resource));
  } catch (error) {
    console.error('Error fetching event availability:', error);
    return Response.json(
      { error: 'Failed to fetch event availability' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      eventId?: string;
      userId?: string;
      slots?: unknown;
    };

    const eventId = body.eventId?.trim();
    const userId = body.userId?.trim();

    if (!eventId || !userId) {
      return Response.json(
        { error: 'eventId and userId are required' },
        { status: 400 },
      );
    }

    const saved = await upsertEventAvailabilityForUser(
      eventId,
      userId,
      body.slots,
    );

    return Response.json(normalizeAvailability(saved));
  } catch (error) {
    console.error('Error saving event availability:', error);
    return Response.json(
      { error: 'Failed to save event availability' },
      { status: 500 },
    );
  }
}
