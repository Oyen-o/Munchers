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
        <Stack spacing={1.5}>
          {plans.map((plan) => (
            <Card key={plan.id} className="place-plans__card">
              <Stack spacing={1.5}>
                {/* Title and Stage */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                    {plan.title}
                  </Typography>
                  {plan.stage === 'idea' && (
                    <Chip
                      label="Idea"
                      size="small"
                      className="place-plans__idea-badge"
                    />
                  )}
                </Stack>

                {/* Creator and Group */}
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <Person
                      fontSize="small"
                      sx={{ color: 'var(--color-text-secondary)' }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: 'var(--color-text-secondary)' }}
                    >
                      Created by {plan.creatorName || plan.createdBy}
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
                        sx={{ color: 'var(--color-text-secondary)' }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: 'var(--color-text-secondary)' }}
                      >
                        {plan.groupName}
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                {/* Date and Attendees */}
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <CalendarToday
                      fontSize="small"
                      sx={{ color: 'var(--color-text-secondary)' }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatDate(plan.plannedDate || null)}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="caption"
                    sx={{ color: 'var(--color-text-secondary)' }}
                  >
                    {plan.attendeeCount}{' '}
                    {plan.attendeeCount === 1 ? 'person' : 'people'} interested
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
