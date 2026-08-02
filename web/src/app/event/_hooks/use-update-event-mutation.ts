import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EventDocument } from 'src/lib/cosmos/cosmos.types';
import type { Event } from 'src/lib/types';

type UpdateEventInput = {
  id: string;
  title?: string;
  description?: string;
  location?: Event['location'];
  plannedDate?: Date | string;
  time?: string;
  coverImageUrl?: string;
  stage?: Event['stage'];
};

function toEvent(document: EventDocument): Event {
  return {
    id: document.id,
    partitionKey: document.partitionKey,
    type: document.type,
    ownerId: document.ownerId,
    ownerType: document.ownerType,
    groupId: document.groupId,
    visibility: document.visibility,
    eventStyle: document.eventStyle,
    title: document.title,
    description: document.description,
    metadata: document.metadata as Event['metadata'],
    images: document.images,
    location: document.location,
    time: document.time,
    startTime: document.startTime,
    endTime: document.endTime,
    coverImageUrl: document.coverImageUrl,
    stage: document.stage ?? 'idea',
    createdBy: document.createdBy,
    hostId: document.hostId,
    hostName: document.hostName,
    plannedDate: document.plannedDate ? new Date(document.plannedDate) : undefined,
    capacity: document.capacity,
    status: document.status,
    recurrence: document.recurrence,
    attendeeCount: document.attendeeCount,
    averageFriendRating: document.averageFriendRating,
    averageCommunityRating: document.averageCommunityRating,
    comments: [],
    ratings: [],
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    _etag: document._etag,
  };
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation<Event, Error, UpdateEventInput>({
    mutationFn: async (payload) => {
      const requestBody = {
        ...payload,
        plannedDate:
          payload.plannedDate instanceof Date
            ? payload.plannedDate.toISOString()
            : payload.plannedDate,
      };

      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Events API returned ${response.status}`);
      }

      const data = (await response.json()) as EventDocument;
      return toEvent(data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
