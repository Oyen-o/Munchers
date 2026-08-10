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
  experienceId: string;
  experienceTitle: string;
  experienceImage: string;
  experienceCategory: string;
  createdBy: string;
  creatorName?: string;
  creatorAvatar?: string;
  groupId?: string | null;
  groupName?: string | null;
  groupAvatar?: string | null;
  plannedDate?: string | null;
  status: 'idea' | 'planning' | 'upcoming';
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
        See what experiences people want to try at this place
      </Typography>

      {plans.length === 0 ? (
        <Card className="place-plans__card place-plans__card--empty">
          <Typography
            variant="body2"
            sx={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}
          >
            Be the first to create a plan for an experience at this place.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onCreatePlan}
            sx={{ mt: 2 }}
          >
            Create Plan
          </Button>
        </Card>
      ) : (
        <Box className="place-plans__carousel">
          {plans.map((plan) => (
            <Box key={plan.id} className="place-plans__plan-card">
              {/* Experience Image with Overlay */}
              <Box className="place-plans__plan-img-backdrop">
                <Stack
                  className="place-plans__plan-header-layer"
                  direction="column"
                  spacing={0.5}
                >
                  {/* Status Badge */}
                  {plan.status && (
                    <Chip
                      label={
                        plan.status === 'idea'
                          ? 'Want to try'
                          : plan.status === 'planning'
                            ? 'Planning'
                            : 'Upcoming'
                      }
                      size="small"
                      className="place-plans__idea-badge"
                    />
                  )}

                  {/* Experience Title (primary) */}
                  <Typography
                    variant="h6"
                    className="place-plans__experience-title"
                  >
                    {plan.experienceTitle}
                  </Typography>

                  {/* Experience Category */}
                  <Typography
                    variant="caption"
                    className="place-plans__experience-category"
                  >
                    {plan.experienceCategory}
                  </Typography>
                </Stack>

                <Box className="place-plans__plan-image-gradient" />
                <img
                  className="place-plans__plan-image"
                  src={plan.experienceImage}
                  alt={plan.experienceTitle}
                />
              </Box>

              {/* Plan Content */}
              <Stack className="place-plans__plan-content" spacing={1.5}>
                {/* Plan Title (user's context) */}
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, fontSize: '0.95rem' }}
                >
                  {plan.title}
                </Typography>

                {/* Creator Info */}
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
                      {!plan.groupId && (
                        <span style={{ marginLeft: 4, fontStyle: 'italic' }}>
                          (Personal)
                        </span>
                      )}
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

                {/* Date (if scheduled) */}
                {plan.plannedDate && (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <CalendarToday
                      fontSize="small"
                      sx={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 14,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    >
                      {formatDate(plan.plannedDate)}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
