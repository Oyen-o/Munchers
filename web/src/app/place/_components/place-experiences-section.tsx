'use client';

import { Box, Card, Stack, Typography } from '@mui/material';
import { Star, Group as GroupIcon } from '@mui/icons-material';

import './place-experiences-section.scss';

export function PlaceExperiencesSection() {
  return (
    <Box className="place-experiences">
      <Typography variant="h5" className="place-experiences__title">
        Experiences
      </Typography>
      <Typography variant="body2" className="place-experiences__subtitle">
        Discover curated experiences at this place
      </Typography>

      <Stack spacing={3}>
        {/* Official Experiences */}
        <Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', mb: 1.5 }}
          >
            <Star sx={{ color: '#f59e0b', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Official Experiences
            </Typography>
          </Stack>

          <Card className="place-experiences__card place-experiences__card--empty">
            <Typography
              variant="body2"
              sx={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}
            >
              No official experiences yet.
            </Typography>
          </Card>
        </Box>

        {/* Community Experiences */}
        <Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', mb: 1.5 }}
          >
            <GroupIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Community Experiences
            </Typography>
          </Stack>

          <Card className="place-experiences__card place-experiences__card--empty">
            <Typography
              variant="body2"
              sx={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}
            >
              Community experiences coming soon.
            </Typography>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}
