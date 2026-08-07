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
import { Group, ExpandMore, ExpandLess, FormatListNumbered } from '@mui/icons-material';
import type { PlaceGroupLists } from 'src/lib/types';

import './place-ratings-section.scss';

type PlaceRatingsSectionProps = {
  lists?: PlaceGroupLists;
  loading?: boolean;
};

export function PlaceRatingsSection({
  lists,
  loading,
}: PlaceRatingsSectionProps) {
  const [showPopularLists, setShowPopularLists] = useState(false);
  
  if (loading) {
    return (
      <Box className="place-ratings">
        <Typography variant="h5" className="place-ratings__title">
          Group Lists
        </Typography>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const ListDisplay = ({
    listName,
    rank,
    totalItems,
  }: {
    listName: string;
    rank?: number;
    totalItems: number;
  }) => (
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <FormatListNumbered sx={{ color: 'var(--color-dark-brown)', fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--color-dark-brown)' }}>
          {listName}
        </Typography>
      </Stack>
      {rank && (
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
          #{rank} of {totalItems}
        </Typography>
      )}
    </Stack>
  );

  return (
    <Box className="place-ratings">
      <Typography variant="h5" className="place-ratings__title">
        Group Lists
      </Typography>
      <Typography variant="body2" className="place-ratings__subtitle">
        See which group lists include this place
      </Typography>

      <Stack spacing={2}>
        {/* User's Group Lists */}
        {lists?.userGroupLists && lists.userGroupLists.length > 0 && (
          <Box>
            <Typography variant="h6" className="place-ratings__section-title">
              Your Groups
            </Typography>
            <Box className="place-ratings__carousel">
              {lists.userGroupLists.map((item) => (
                <Box key={item.listId} className="place-ratings__rating-card">
                  <Stack spacing={1.5} sx={{ height: '100%' }}>
                    <Typography
                      variant="h6"
                      className="place-ratings__group-name"
                    >
                      {item.groupName}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <ListDisplay
                        listName={item.listName}
                        rank={item.rank}
                        totalItems={item.totalItems}
                      />
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Popular Group Lists */}
        {lists?.popularGroupLists && lists.popularGroupLists.length > 0 && (
          <Box>
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography variant="h6" className="place-ratings__section-title">
                Popular Groups
              </Typography>
              <Button
                size="small"
                endIcon={showPopularLists ? <ExpandLess /> : <ExpandMore />}
                onClick={() => setShowPopularLists(!showPopularLists)}
                sx={{ textTransform: 'none' }}
              >
                {showPopularLists ? 'Hide' : 'Show'} ({lists.popularGroupLists.length})
              </Button>
            </Stack>
            {showPopularLists && (
              <Box className="place-ratings__carousel">
                {lists.popularGroupLists.map((item) => (
                  <Box key={item.listId} className="place-ratings__rating-card">
                    <Stack spacing={1.5} sx={{ height: '100%' }}>
                      <Typography
                        variant="h6"
                        className="place-ratings__group-name"
                      >
                        {item.groupName}
                      </Typography>
                      <Box sx={{ mt: 'auto' }}>
                        <ListDisplay
                          listName={item.listName}
                          rank={item.rank}
                          totalItems={item.totalItems}
                        />
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
