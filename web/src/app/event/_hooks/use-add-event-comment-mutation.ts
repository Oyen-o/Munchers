import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentDocument } from 'src/lib/cosmos/cosmos.types';
import type { Comment } from 'src/lib/types';

type AddEventCommentInput = {
  eventId: string;
  userId: string;
  content: string;
};

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

// Hook to add a comment to a specific event
export function useAddEventCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, AddEventCommentInput>({
    mutationFn: async ({ eventId, userId, content }) => {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          userId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Comments API returned ${response.status}`);
      }

      const payload = (await response.json()) as CommentDocument;
      return toComment(payload);
    },
    onSuccess: (createdComment, variables) => {
      const queryKey = ['event-comments', variables.eventId] as const;
      queryClient.setQueryData<Comment[]>(queryKey, (existing) => [
        createdComment,
        ...(existing ?? []),
      ]);
    },
  });
}
