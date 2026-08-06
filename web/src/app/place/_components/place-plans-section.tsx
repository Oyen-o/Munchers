'use client';

import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Add, CalendarToday, Person, Group } from '@mui/icons-material';

import './place-plans-section.scss';

type Plan = {
  id: string;
  title: string;
  placeId: string;
  createdBy: string;
  creatorName?: string;
  groupId?: string | null;
  groupName?: string | null;
  plannedDate?: string | null;
  stage: string;
  attendeeCount: number;
  createdAt: string;
};

type PlacePlansSectionProps = {
  plans: Plan[];
  loading?: boolean;
  onCreatePlan: () => void;
};

export function PlacePlansSection({
  plans,
  loading,
  onCreatePlan,
}: PlacePlansSectionProps) {
  if (loading) {
    return (
      <Box className="place-plans">
        <Typography variant="h5" className="place-plans__title">
          Plans
        </Typography>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box className="place-plans">
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
      >
        <Typography variant="h5" className="place-plans__title">
          Plans
        </Typography>
        <Button
          size="small"
          startIcon={<Add />}
          onClick={onCreatePlan}
          variant="outlined"
        >
          New Plan
        </Button>
      </Stack>

      <Typography variant="body2" className="place-plans__subtitle">
        Upcoming plans at this place
      </Typography>

      {plans.length === 0 ? (
        <Card className="place-plans__card place-plans__card--empty">
          <Typography
            variant="body2"
            sx={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}
          >
            No plans yet. Be the first to create one!
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onCreatePlan}
            sx={{ mt: 2 }}
          >
            Create First Plan
          </Button>
        </Card>
      ) : (
        <Box className="place-plans__carousel">
          {plans.map((plan) => (
            <Box key={plan.id} className="place-plans__plan-card">
              {/* Plan Image Backdrop */}
              <Box className="place-plans__plan-img-backdrop">
                <Stack
                  className="place-plans__plan-header-layer"
                  direction="column"
                >
                  <Stack
                    className="place-plans__plan-header-row"
                    direction="row"
                  >
                    {plan.stage === 'idea' && (
                      <Chip
                        label="Idea"
                        size="small"
                        className="place-plans__idea-badge"
                      />
                    )}
                  </Stack>
                  <Typography variant="h5" className="place-plans__plan-title">
                    {plan.title}
                  </Typography>
                </Stack>

                <Box className="place-plans__plan-image-gradient" />
                <img
                  className="place-plans__plan-image"
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop"
                  alt={plan.title}
                />
              </Box>

              {/* Plan Content */}
              <Stack className="place-plans__plan-content" spacing={1}>
                {/* Creator and Group */}
                <Stack spacing={0.5}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <Person
                      fontSize="small"
                      sx={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 14,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {plan.creatorName || plan.createdBy}
                    </Typography>
                  </Stack>

                  {plan.groupId && plan.groupName && (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <Group
                        fontSize="small"
                        sx={{
                          color: 'var(--color-text-secondary)',
                          fontSize: 14,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'var(--color-text-secondary)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {plan.groupName}
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                {/* Date */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <CalendarToday
                    fontSize="small"
                    sx={{ color: 'var(--color-text-secondary)', fontSize: 14 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  >
                    {formatDate(plan.plannedDate || null)}
                  </Typography>
                </Stack>

                {/* Attendees */}
                <Typography
                  variant="caption"
                  sx={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.7rem',
                  }}
                >
                  {plan.attendeeCount}{' '}
                  {plan.attendeeCount === 1 ? 'person' : 'people'} interested
                </Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
