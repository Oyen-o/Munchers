import { Box, Card, IconButton, Stack, Typography } from '@mui/material';
import { Shimmer } from 'src/lib/UI/shimmer';
import {
  WHEN_TO_MEET_DEFAULT_DAYS,
  type WhenToMeetDay,
} from 'src/lib/availability/when-to-meet-slots';
import { WhenToMeetGridSkeleton } from '../when-to-meet-grid';
import { ArrowBack } from '@mui/icons-material';

type EventDetailSkeletonProps = {
  visibleAvailabilityDays?: WhenToMeetDay[];
};

export function EventDetailSkeleton({
  visibleAvailabilityDays = [...WHEN_TO_MEET_DEFAULT_DAYS],
}: EventDetailSkeletonProps) {
  return (
    <Box className="event-detail-page__container" aria-busy="true">
      <Stack className="event-detail-page__nav" direction="row">
        <IconButton
          onClick={() => window.history.back()}
          className="event-detail-page__back-button"
        >
          <ArrowBack sx={{ marginRight: '12px' }} />
          Back To Feed
        </IconButton>
      </Stack>

      <Stack className="event-detail-page__stack" gap={3}>
        <Box className="event-detail-page__hero-section">
          <Card className="event-detail-page__hero-card">
            <Stack
              className="event-detail-page__card-top"
              direction="row"
              spacing={2}
            >
              <Stack className="event-detail-page__card-top-right">
                <Shimmer width={110} height={45} borderRadius={16} />
              </Stack>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '180px',
                padding: '0 var(--spacing-md)',
              }}
            >
              <Box
                sx={{
                  width: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',

                  gap: 1,
                }}
              >
                <Shimmer width={56} height={26} borderRadius={6} />
                <Shimmer width={160} height={100} borderRadius={6} />
              </Box>

              <Stack
                sx={{
                  width: '50%',
                  gap: 1.5,
                  justifyContent: 'flex-end',
                  height: '100%',
                  padding: '0 0 var(--spacing-md) var(--spacing-lg)',
                }}
              >
                <Shimmer width="85%" height={14} borderRadius={2} />
                <Shimmer width="95%" height={14} borderRadius={2} />
                <Shimmer width="70%" height={14} borderRadius={2} />
              </Stack>
            </Stack>

            <Box
              className="event-detail-page__title"
              sx={{
                px: 2,
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Shimmer width="68%" height={40} borderRadius={1} />
            </Box>
          </Card>

          <Box
            className="event-detail-page__rsvp-button-container"
            sx={{
              position: 'relative',
              zIndex: 10,
              marginTop: '-28px !important',
              marginBottom: '-28px',
              padding: '0 var(--spacing-lg)',
            }}
          >
            <Shimmer width="33%" height={46} borderRadius={20} />
          </Box>
        </Box>

        <Card className="event-detail-page__description-card event-detail-page__paper">
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Shimmer width={52} height={28} borderRadius={999} />
          </Stack>
          <Shimmer width="100%" height={16} borderRadius={8} marginTop={8} />
          <Shimmer width="92%" height={16} borderRadius={8} marginTop={8} />
          <Shimmer width="64%" height={16} borderRadius={8} marginTop={8} />
        </Card>

        <Box className="event-detail-page__image">
          <Shimmer width="100%" height="100%" borderRadius={0} />
        </Box>

        <Card className="event-detail-page__when-to-meet-card event-detail-page__paper">
          <Shimmer width={130} height={22} borderRadius={8} />
          <Shimmer width={220} height={14} borderRadius={8} marginTop={8} />
          <WhenToMeetGridSkeleton visibleDays={visibleAvailabilityDays} />
        </Card>

        <Card className="event-detail-page__attendees-card event-detail-page__paper">
          <Shimmer width={260} height={16} borderRadius={8} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              mt: 1.5,
            }}
          >
            <Shimmer width={30} height={30} borderRadius="50%" />
            <Shimmer width={30} height={30} borderRadius="50%" />
            <Shimmer width={30} height={30} borderRadius="50%" />
            <Shimmer width={30} height={30} borderRadius="50%" />
          </Box>
        </Card>

        <Card className="event-detail-page__comments-card event-detail-page__paper">
          <Shimmer width={160} height={22} borderRadius={8} />
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box
              className="event-detail-page__comment"
              sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}
            >
              <Shimmer width={32} height={32} borderRadius="50%" />
              <Box sx={{ flex: 1 }}>
                <Shimmer width={86} height={14} borderRadius={6} />
                <Shimmer
                  width="100%"
                  height={14}
                  borderRadius={6}
                  marginTop={8}
                />
                <Shimmer
                  width={70}
                  height={12}
                  borderRadius={6}
                  marginTop={8}
                />
              </Box>
            </Box>
            <Box
              className="event-detail-page__comment"
              sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}
            >
              <Shimmer width={32} height={32} borderRadius="50%" />
              <Box sx={{ flex: 1 }}>
                <Shimmer width={94} height={14} borderRadius={6} />
                <Shimmer
                  width="88%"
                  height={14}
                  borderRadius={6}
                  marginTop={8}
                />
                <Shimmer
                  width={78}
                  height={12}
                  borderRadius={6}
                  marginTop={8}
                />
              </Box>
            </Box>
          </Stack>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
            <Shimmer width="100%" height={40} borderRadius={8} />
            <Shimmer width={40} height={40} borderRadius="50%" />
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}
