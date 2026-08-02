import { Fragment } from 'react';
import { Box, Typography } from '@mui/material';
import { Shimmer } from 'src/lib/UI/shimmer';
import {
  WHEN_TO_MEET_DEFAULT_DAYS,
  WHEN_TO_MEET_GRID,
  WHEN_TO_MEET_PERIODS,
  type WhenToMeetDay,
} from 'src/lib/availability/when-to-meet-slots';

import './when-to-meet-grid.scss';

type WhenToMeetGridSkeletonProps = {
  visibleDays?: WhenToMeetDay[];
};

export function WhenToMeetGridSkeleton({
  visibleDays,
}: WhenToMeetGridSkeletonProps) {
  const activeDays =
    visibleDays && visibleDays.length > 0
      ? visibleDays
      : [...WHEN_TO_MEET_DEFAULT_DAYS];

  return (
    <Box className="when-to-meet-grid when-to-meet-grid--skeleton">
      <Box className="when-to-meet-grid__table">
        <Box className="when-to-meet-grid__header-spacer" />
        {WHEN_TO_MEET_PERIODS.map((period) => (
          <Typography
            key={period}
            variant="caption"
            className="when-to-meet-grid__header"
          >
            {period}
          </Typography>
        ))}
        <Box className="when-to-meet-grid__header-spacer" />

        {activeDays.map((day) => (
          <Fragment key={day}>
            <Typography
              variant="caption"
              className="when-to-meet-grid__day-label"
            >
              {day}
            </Typography>
            {WHEN_TO_MEET_GRID[day].map((slot) => (
              <Box key={slot} className="when-to-meet-grid__cell-skeleton">
                <Shimmer width="100%" height={44} borderRadius={10} />
              </Box>
            ))}
            <Box className="when-to-meet-grid__remove-cell" />
          </Fragment>
        ))}
      </Box>
    </Box>
  );
}
