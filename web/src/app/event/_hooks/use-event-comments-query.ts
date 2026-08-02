import { useQuery } from '@tanstack/react-query';
import type { Comment } from '../../../../lib/types';
import type { CommentDocument } from '../../../../lib/cosmos/cosmos.types';

function toComment(document: CommentDocument): Comment {
  return {
    id: document.id,
    eventId: document.eventId,
    groupId: document.groupId,
    userId: document.userId,
    content: document.content,
    createdAt: new Date(document.createdAt),
    updatedAt: new Date(document.updatedAt ?? document.createdAt),
  };
}

// Hook to fetch comments for a specific event
export function useEventCommentsQuery(eventId?: string) {
  return useQuery<Comment[], Error>({
    queryKey: ['event-comments', eventId],
    enabled: Boolean(eventId),
    retry: false,
    queryFn: async () => {
      if (!eventId) {
        return [];
      }

      const response = await fetch(
        `/api/comments?eventId=${encodeURIComponent(eventId)}`,
      );

      if (!response.ok) {
        throw new Error(`Comments API returned ${response.status}`);
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        return [];
      }

      return (data as CommentDocument[]).map(toComment);
    },
  });
}
