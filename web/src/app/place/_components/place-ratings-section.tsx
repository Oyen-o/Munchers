'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Group, ExpandMore, ExpandLess } from '@mui/icons-material';
import type { PlaceCommunityRatings } from 'src/lib/types';
import { getRatingImage } from 'src/lib/utils';

import './place-ratings-section.scss';

type PlaceRatingsSectionProps = {
  ratings?: PlaceCommunityRatings;
  loading?: boolean;
};

export function PlaceRatingsSection({
  ratings,
  loading,
}: PlaceRatingsSectionProps) {
  const [showPopularGroups, setShowPopularGroups] = useState(false);
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
      <img
        src={getRatingImage(value)}
        alt="star"
        style={{ width: 45, height: 45 }}
      />
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
        {/* User's Groups */}
        {ratings?.userGroups && ratings.userGroups.length > 0 && (
          <Box>
            <Typography variant="h6" className="place-ratings__section-title">
              Your Groups
            </Typography>
            <Box className="place-ratings__carousel">
              {ratings.userGroups.map((group) => (
                <Box key={group.groupId} className="place-ratings__rating-card">
                  <Stack spacing={1.5} sx={{ height: '100%' }}>
                    <Typography
                      variant="h6"
                      className="place-ratings__group-name"
                    >
                      {group.groupName}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <RatingDisplay
                        value={group.average}
                        count={group.count}
                      />
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Popular Community Groups */}
        {ratings?.popularGroups && ratings.popularGroups.length > 0 && (
          <Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: showPopularGroups ? 0.5 : 0,
              }}
            >
              <Typography variant="h6" className="place-ratings__section-title">
                Popular Community Ratings
              </Typography>
              <Button
                size="small"
                endIcon={showPopularGroups ? <ExpandLess /> : <ExpandMore />}
                onClick={() => setShowPopularGroups(!showPopularGroups)}
                sx={{ textTransform: 'none' }}
              >
                {showPopularGroups ? 'Hide' : 'Show'}
              </Button>
            </Stack>
            {!showPopularGroups && (
              <Typography
                variant="caption"
                sx={{ color: 'var(--color-text-secondary)', display: 'block' }}
              >
                Top 10 groups by number of ratings
              </Typography>
            )}
            {showPopularGroups && (
              <>
                <Typography
                  variant="caption"
                  sx={{ color: 'var(--color-text-secondary)', mb: 1.5 }}
                >
                  Top 10 groups by number of ratings
                </Typography>
                <Box className="place-ratings__carousel">
                  {ratings.popularGroups.slice(0, 10).map((group, index) => (
                    <Box
                      key={group.groupId}
                      className="place-ratings__rating-card"
                    >
                      <Stack spacing={1.5} sx={{ height: '100%' }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: 'center' }}
                        >
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            sx={{ minWidth: 40, fontWeight: 700 }}
                          />
                        </Stack>
                        <Typography
                          variant="h6"
                          className="place-ratings__group-name"
                        >
                          {group.groupName}
                        </Typography>
                        <Box sx={{ mt: 'auto' }}>
                          <RatingDisplay
                            value={group.average}
                            count={group.count}
                          />
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Box>
              </>
            )}
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
