import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  WHEN_TO_MEET_SLOTS,
  type WhenToMeetSlot,
} from 'src/lib/availability/when-to-meet-slots';

type EventAvailabilityDocument = {
  id: string;
  type: 'eventAvailability';
  eventId: string;
  userId: string;
  updatedAt: string;
  slots: WhenToMeetSlot[];
};

type EventAvailabilitySummary = {
  eventId: string;
  counts: Record<WhenToMeetSlot, number>;
  totalResponses: number;
};

type SaveAvailabilityInput = {
  eventId: string;
  userId: string;
  slots: WhenToMeetSlot[];
};

function sanitizeSlots(value: unknown): WhenToMeetSlot[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((slot): slot is WhenToMeetSlot =>
    WHEN_TO_MEET_SLOTS.includes(slot as WhenToMeetSlot),
  );
}

function getUserQueryKey(eventId?: string, userId?: string) {
  return ['event-availability', eventId, userId] as const;
}

function getSummaryQueryKey(eventId?: string) {
  return ['event-availability-summary', eventId] as const;
}

export function useEventAvailability(eventId?: string, userId?: string) {
  const queryClient = useQueryClient();
  const userQueryKey = getUserQueryKey(eventId, userId);
  const summaryQueryKey = getSummaryQueryKey(eventId);

  const userAvailabilityQuery = useQuery<EventAvailabilityDocument, Error>({
    queryKey: userQueryKey,
    enabled: Boolean(eventId && userId),
    retry: false,
    queryFn: async () => {
      const response = await fetch(
        `/api/event-availability?eventId=${encodeURIComponent(eventId ?? '')}&userId=${encodeURIComponent(userId ?? '')}`,
      );

      if (!response.ok) {
        throw new Error(`Availability API returned ${response.status}`);
      }

      const data = (await response.json()) as EventAvailabilityDocument;
      return {
        ...data,
        slots: sanitizeSlots(data.slots),
      };
    },
  });

  const summaryQuery = useQuery<EventAvailabilitySummary, Error>({
    queryKey: summaryQueryKey,
    enabled: Boolean(eventId),
    retry: false,
    queryFn: async () => {
      const response = await fetch(
        `/api/event-availability/summary?eventId=${encodeURIComponent(eventId ?? '')}`,
      );

      if (!response.ok) {
        throw new Error(`Availability summary API returned ${response.status}`);
      }

      return (await response.json()) as EventAvailabilitySummary;
    },
  });

  const saveAvailabilityMutation = useMutation<
    EventAvailabilityDocument,
    Error,
    SaveAvailabilityInput,
    { previousUser?: EventAvailabilityDocument }
  >({
    mutationFn: async (payload) => {
      const response = await fetch('/api/event-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Availability API returned ${response.status}`);
      }

      const data = (await response.json()) as EventAvailabilityDocument;
      return {
        ...data,
        slots: sanitizeSlots(data.slots),
      };
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: userQueryKey });
      const previousUser = queryClient.getQueryData<EventAvailabilityDocument>(
        userQueryKey,
      );

      queryClient.setQueryData<EventAvailabilityDocument>(userQueryKey, {
        id: `${payload.eventId}_${payload.userId}`,
        type: 'eventAvailability',
        eventId: payload.eventId,
        userId: payload.userId,
        updatedAt: new Date().toISOString(),
        slots: sanitizeSlots(payload.slots),
      });

      return { previousUser };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(userQueryKey, context.previousUser);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: summaryQueryKey });
    },
  });

  const toggleAvailabilitySlot = async (slot: WhenToMeetSlot) => {
    if (!eventId || !userId) {
      throw new Error('eventId and userId are required');
    }

    const cached = queryClient.getQueryData<EventAvailabilityDocument>(
      userQueryKey,
    );
    const currentSlots = sanitizeSlots(cached?.slots ?? []);
    const next = new Set(currentSlots);

    if (next.has(slot)) {
      next.delete(slot);
    } else {
      next.add(slot);
    }

    return saveAvailabilityMutation.mutateAsync({
      eventId,
      userId,
      slots: Array.from(next),
    });
  };

  return {
    selectedSlots: userAvailabilityQuery.data?.slots ?? [],
    counts: summaryQuery.data?.counts,
    totalResponses: summaryQuery.data?.totalResponses ?? 0,
    isLoading:
      userAvailabilityQuery.isLoading ||
      summaryQuery.isLoading ||
      saveAvailabilityMutation.isPending,
    isSaving: saveAvailabilityMutation.isPending,
    saveAvailability: async (slots: WhenToMeetSlot[]) => {
      if (!eventId || !userId) {
        throw new Error('eventId and userId are required');
      }

      return saveAvailabilityMutation.mutateAsync({
        eventId,
        userId,
        slots: sanitizeSlots(slots),
      });
    },
    toggleAvailabilitySlot,
    refetchSummary: summaryQuery.refetch,
  };
}
