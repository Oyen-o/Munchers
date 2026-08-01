'use client';

import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Event, EventStage } from 'src/lib/types';
import type { RatingDocument } from 'src/lib/cosmos/cosmos.types';
import { Chip, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { shortFormat } from 'src/lib/utils';
import RatingStars from '../ratings/rating';
import { RatingSkeleton } from '../ratings/rating.skeleton';
import { Avatar } from 'src/components/avatar/avatar';

import './event-item.scss';

export function EventItem({
  event,
  size = 'large',
}: {
  event: Event;
  size?: 'small' | 'medium' | 'large';
}) {
  const queryClient = useQueryClient();
  const currentUserId = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem('phoneNumber');
  }, []);

  const ratingQueryKey = ['event-rating', event.id, currentUserId] as const;

  // Fetch the user's rating for this event
  const ratingQuery = useQuery<RatingDocument | null, Error>({
    queryKey: ratingQueryKey,
    enabled: Boolean(currentUserId && event.id),
    retry: false,
    staleTime: Infinity,
    queryFn: async () => {
      const response = await fetch(
        `/api/ratings?userId=${currentUserId}&eventId=${event.id}`,
      );

      if (!response.ok) {
        throw new Error(`Ratings API returned ${response.status}`);
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        return null;
      }

      return data[0] as RatingDocument;
    },
  });

  // Mutation to add or update the user's rating for this event
  const ratingMutation = useMutation<RatingDocument, Error, number>({
    mutationFn: async (rating) => {
      if (!currentUserId) {
        throw new Error('Missing current user id');
      }

      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          eventId: event.id,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ratings API returned ${response.status}`);
      }

      return (await response.json()) as RatingDocument;
    },
    onSuccess: (updatedRating) => {
      queryClient.setQueryData(ratingQueryKey, updatedRating);
    },
  });

  const userRating = ratingMutation.isPending
    ? ratingMutation.variables
    : (ratingQuery.data?.rating ?? 0);

  const getStageColor = (stage: EventStage) => {
    const colors = {
      idea: 'var(--color-stage-idea)',
      picked: 'var(--color-stage-picked)',
      planned: 'var(--color-stage-planned)',
    };
    return colors[stage];
  };

  return (
    <Box
      key={event.id}
      className={`event-item__container ${size === 'large' ? 'event-item__container--large' : ''}`}
    >
      {/* Event Image */}
      <Box
        className={`event-item__event-card ${size === 'large' ? 'event-item__event-card--large' : ''}`}
        onClick={() => {
          console.log(
            'Navigating to event detail page for event ID:',
            event.id,
          );
          window.location.href = `/event/${event.id}`;
        }}
      >
        <Stack className="event-item__event-header-layer" direction="column">
          <Stack className="event-item__event-header-row" direction="row">
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Avatar
                src={event.metadata?.hostAvatarUrl || '/images/avatar.png'}
                alt={event.hostName || 'Host Avatar'}
                size="medium"
              />
              <Typography
                variant="body2"
                className="event-item__event-subtitle"
              >
                {event.hostName && `${event.hostName}`}
              </Typography>
            </Stack>
            <Chip
              label={event.stage}
              size="small"
              className={`event-item__event-stage-badge`}
              sx={{
                backgroundColor: getStageColor(event.stage),
              }}
            />
          </Stack>
          <Typography variant="h4" className="event-item__event-title">
            {event.title}
          </Typography>
        </Stack>

        <Box className="event-item__event-image-gradient" />
        <img
          className="event-item__event-image"
          src={
            event.coverImageUrl ||
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop'
          }
          alt={event.title}
        />
      </Box>

      {/* Event Content */}
      <Stack className="event-item__event-content" spacing={1} sx={{}}>
        {size != 'large' && (
          <Box sx={{ width: '100%' }}>
            <Typography
              variant="body2"
              className="event-item__event-subtitle"
              sx={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Avatar
                src={event.metadata?.hostAvatarUrl || '/images/avatar.png'}
                alt={event.hostName || 'Host Avatar'}
                size="medium"
              />
              {event.hostName && `${event.hostName}`}
            </Typography>
            <Typography variant="h6" className="event-item__event-title">
              {event.title}
            </Typography>
          </Box>
        )}

        {
          <Typography
            variant="caption"
            sx={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.75rem',
            }}
          >
            {event.time ?? 'Time not specified'}
          </Typography>
        }
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'var(--color-text-secondary)',
              fontSize: '0.75rem',
            }}
          >
            {event.plannedDate
              ? shortFormat(new Date(event.plannedDate))
              : 'Date not specified'}
          </Typography>
        </Stack>

        {/* <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <LocationIcon
                      sx={{
                        fontSize: 14,
                        color: 'var(--color-text-secondary)',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {event.location
                        ? event.location
                        : 'Location not specified'}
                    </Typography>
                  </Stack> */}

        <Box
          className="event-item__event-rating"
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {ratingQuery.isPending ? (
            <RatingSkeleton />
          ) : (
            <RatingStars
              rating={userRating}
              fontSize={36}
              onRatingChange={(rating) => {
                if (!currentUserId) {
                  return;
                }

                ratingMutation.mutate(rating);
              }}
            ></RatingStars>
          )}
        </Box>
        {/* Comments indicator */}
        {event.comments && event.comments.length > 0 && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              alignItems: 'center',
            }}
          >
            {/* {event.comments.slice(0, 3).map((comment, idx) => (
                        <Box
                          key={idx}
                          className="event-item__event-avatar"
                          sx={{
                            zIndex: 3 - idx,
                            backgroundColor: '#a8fec2',
                            width: '24px',
                            height: '24px',
                          }}
                        ></Box>
                      ))} */}

            {/* <Typography
                        variant="caption"
                        sx={{ color: 'var(--color-text-secondary)', ml: 0.5, fontSize: '0.7rem' }}
                      >
                        {event.comments.length}{' '}
                        {event.comments.length === 1 ? 'comment' : 'comments'}
                      </Typography> */}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
