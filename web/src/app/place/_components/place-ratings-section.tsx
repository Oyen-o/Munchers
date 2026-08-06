'use client';

import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Star, Group } from '@mui/icons-material';
import type { PlaceCommunityRatings } from 'src/lib/types';

import './place-ratings-section.scss';

type PlaceRatingsSectionProps = {
  ratings?: PlaceCommunityRatings;
  loading?: boolean;
};

export function PlaceRatingsSection({
  ratings,
  loading,
}: PlaceRatingsSectionProps) {
  if (loading) {
    return (
      <Box className="place-ratings">
        <Typography variant="h5" className="place-ratings__title">
          Community Ratings
        </Typography>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const RatingDisplay = ({
    value,
    count,
  }: {
    value: number;
    count: number;
  }) => (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <Star sx={{ color: '#f59e0b', fontSize: 20 }} />
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {value.toFixed(1)}
      </Typography>
      <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
        ({count} {count === 1 ? 'rating' : 'ratings'})
      </Typography>
    </Stack>
  );

  return (
    <Box className="place-ratings">
      <Typography variant="h5" className="place-ratings__title">
        Community Ratings
      </Typography>
      <Typography variant="body2" className="place-ratings__subtitle">
        See what your community thinks about this place
      </Typography>

      <Stack spacing={2}>
        {/* Friends Rating */}
        {ratings?.friends && ratings.friends.count > 0 && (
          <Card className="place-ratings__card place-ratings__card--friends">
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Your Friends
                </Typography>
                <Chip
                  icon={<Group sx={{ fontSize: 14 }} />}
                  label="Friends"
                  size="small"
                  color="primary"
                />
              </Stack>
              <RatingDisplay
                value={ratings.friends.average}
                count={ratings.friends.count}
              />
            </Stack>
          </Card>
        )}

        {/* User's Groups */}
        {ratings?.userGroups && ratings.userGroups.length > 0 && (
          <Box>
            <Typography variant="h6" className="place-ratings__section-title">
              Your Groups
            </Typography>
            <Stack spacing={1.5}>
              {ratings.userGroups.map((group) => (
                <Card key={group.groupId} className="place-ratings__card">
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {group.groupName}
                      </Typography>
                      <RatingDisplay
                        value={group.average}
                        count={group.count}
                      />
                    </Box>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        {/* Popular Community Groups */}
        {ratings?.popularGroups && ratings.popularGroups.length > 0 && (
          <Box>
            <Typography variant="h6" className="place-ratings__section-title">
              Popular Community Ratings
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'var(--color-text-secondary)' }}
            >
              Top 10 groups by number of ratings
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 1.5 }}>
              {ratings.popularGroups.slice(0, 10).map((group, index) => (
                <Card key={group.groupId} className="place-ratings__card">
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: 'center', flex: 1 }}
                    >
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{ minWidth: 40, fontWeight: 700 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {group.groupName}
                        </Typography>
                        <RatingDisplay
                          value={group.average}
                          count={group.count}
                        />
                      </Box>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        {!ratings?.friends &&
          (!ratings?.userGroups || ratings.userGroups.length === 0) &&
          (!ratings?.popularGroups || ratings.popularGroups.length === 0) && (
            <Card className="place-ratings__card place-ratings__card--empty">
              <Typography
                variant="body2"
                sx={{ color: 'var(--color-text-secondary)' }}
              >
                No community ratings yet. Be the first to rate this place!
              </Typography>
            </Card>
          )}
      </Stack>
    </Box>
  );
}
