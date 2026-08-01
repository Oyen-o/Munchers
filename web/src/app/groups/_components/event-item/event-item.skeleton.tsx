import { Box, Stack } from '@mui/system';
import { Shimmer } from 'src/lib/UI/shimmer';
import { RatingSkeleton } from '../ratings/rating.skeleton';

import './event-item.scss';

export function EventItemSkeleton({
  size = 'large',
}: {
  size?: 'small' | 'medium' | 'large';
}) {
  const isLarge = size === 'large';

  return (
    <Box
      className={`event-item__container ${isLarge ? 'event-item__container--large' : ''}`}
    >
      <Box
        className={`event-item__event-card ${isLarge ? 'event-item__event-card--large' : ''}`}
      >
        <Box className="event-item__event-image-gradient" />
        <Shimmer className="event-item__event-image" width="100%" height="100%" />
      </Box>

      <Stack className="event-item__event-content" spacing={1}>
        {!isLarge && (
          <Box sx={{ width: '100%' }}>
            <Shimmer width={140} height={16} />
            <Shimmer width="80%" height={24} marginTop={8} />
          </Box>
        )}

        <Shimmer width={120} height={12} />
        <Shimmer width={140} height={12} />

        <Box
          className="event-item__event-rating"
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <RatingSkeleton />
        </Box>
      </Stack>
    </Box>
  );
}
