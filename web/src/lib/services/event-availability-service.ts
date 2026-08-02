import { getEventAvailabilityContainer } from '../cosmos/cosmos';
import type { EventAvailabilityDocument } from '../cosmos/cosmos.types';
import {
  isWhenToMeetSlot,
  toEmptyWhenToMeetCounts,
  type WhenToMeetSlot,
} from '../availability/when-to-meet-slots';

export type EventAvailabilitySummary = {
  eventId: string;
  counts: Record<WhenToMeetSlot, number>;
  totalResponses: number;
};

function sanitizeSlots(slots: unknown): WhenToMeetSlot[] {
  if (!Array.isArray(slots)) {
    return [];
  }

  return slots
    .filter((slot): slot is string => typeof slot === 'string')
    .filter(isWhenToMeetSlot);
}

export async function getEventAvailabilityForUser(
  eventId: string,
  userId: string,
): Promise<EventAvailabilityDocument | null> {
  const container = getEventAvailabilityContainer();
  const { resources } = await container.items
    .query<EventAvailabilityDocument>({
      query:
        'SELECT * FROM c WHERE c.type = "eventAvailability" AND c.eventId = @eventId AND c.userId = @userId',
      parameters: [
        { name: '@eventId', value: eventId },
        { name: '@userId', value: userId },
      ],
    })
    .fetchAll();

  return resources[0] ?? null;
}

export async function upsertEventAvailabilityForUser(
  eventId: string,
  userId: string,
  slots: unknown,
): Promise<EventAvailabilityDocument> {
  const container = getEventAvailabilityContainer();
  const normalizedSlots = sanitizeSlots(slots);
  const now = new Date().toISOString();

  const existing = await getEventAvailabilityForUser(eventId, userId);

  if (existing) {
    const updated: EventAvailabilityDocument = {
      ...existing,
      slots: normalizedSlots,
      updatedAt: now,
    };

    const { resource } = await container
      .item(existing.id, existing.eventId)
      .replace<EventAvailabilityDocument>(updated);

    return resource ?? updated;
  }

  const created: EventAvailabilityDocument = {
    id: `${eventId}_${userId}`,
    type: 'eventAvailability',
    eventId,
    userId,
    slots: normalizedSlots,
    updatedAt: now,
  };

  const { resource } = await container.items.create<EventAvailabilityDocument>(
    created,
  );

  return resource ?? created;
}

export async function getEventAvailabilitySummary(
  eventId: string,
): Promise<EventAvailabilitySummary> {
  const container = getEventAvailabilityContainer();
  const { resources } = await container.items
    .query<EventAvailabilityDocument>({
      query:
        'SELECT * FROM c WHERE c.type = "eventAvailability" AND c.eventId = @eventId',
      parameters: [{ name: '@eventId', value: eventId }],
    })
    .fetchAll();

  const counts = toEmptyWhenToMeetCounts();

  for (const doc of resources) {
    const uniqueSlots = new Set(sanitizeSlots(doc.slots));
    for (const slot of uniqueSlots) {
      counts[slot] += 1;
    }
  }

  return {
    eventId,
    counts,
    totalResponses: resources.length,
  };
}
