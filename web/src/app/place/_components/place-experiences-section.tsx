'use client';

import { useParams } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';

import './place-experiences-section.scss';

// Mock experiences data
const experiencesByPlace: Record<string, any> = {
  '2': {
    official: [
      {
        id: 'official-exp1',
        title: 'Scottsdale Open',
        category: 'Official Tournament',
        description:
          'Annual championship tournament featuring competitive divisions, professional referees, and prize pool. Registration opens 6 weeks in advance.',
        coverImage:
          'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=250&fit=crop',
        badge: 'Official',
      },
    ],
    community: [
      {
        id: 'exp1',
        title: 'Morning Volleyball Meetup',
        category: 'Meetup',
        description:
          'Meet local players for casual games followed by coffee nearby.',
        coverImage:
          'https://images.unsplash.com/photo-1593766787879-e8c78e09cec5?w=400&h=250&fit=crop',
      },
      {
        id: 'exp2',
        title: 'Tournament Weekend',
        category: 'Competition',
        description:
          'Weekend tournaments with multiple courts, vendors, spectators, and championship matches.',
        coverImage:
          'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=250&fit=crop',
      },
      {
        id: 'exp3',
        title: 'Beginner Open Play',
        category: 'Learning',
        description:
          'Perfect for learning rotations, serving, and basic gameplay with experienced players.',
        coverImage:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
      },
      {
        id: 'exp4',
        title: 'Friday Sunset Games',
        category: 'Social',
        description:
          'One of the most popular recurring volleyball nights at this park.',
        coverImage:
          'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&h=250&fit=crop',
      },
    ],
  },
};

export function PlaceExperiencesSection() {
  const params = useParams();
  const placeId = params?.id as string;
  const experiences = experiencesByPlace[placeId];

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
            <img
              src="/ratings/rating-5.png"
              alt="Official experiences"
              style={{ width: 40, height: 40 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Official Experiences
            </Typography>
          </Stack>

          {experiences?.official && experiences.official.length > 0 ? (
            <Box className="place-experiences__carousel">
              {experiences.official.map((exp: any) => (
                <Card
                  key={exp.id}
                  className="place-experiences__card place-experiences__card--filled place-experiences__card--official"
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={exp.coverImage}
                      alt={exp.title}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 'var(--spacing-md)',
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#fff',
                          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                      >
                        {exp.title}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#fff',
                          backgroundColor: 'var(--color-accent-main)',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {exp.badge || 'Official'}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'var(--color-text-secondary)',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      >
                        {exp.category}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{ color: 'var(--color-text-secondary)', mt: 1 }}
                    >
                      {exp.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Card className="place-experiences__card place-experiences__card--empty">
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center',
                }}
              >
                No official experiences yet.
              </Typography>
            </Card>
          )}
        </Box>

        {/* Community Experiences */}
        <Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', mb: 1.5 }}
          >
            <img
              src="/images/home-splash.png"
              alt="Community experiences"
              style={{ width: 60, height: 60 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Community Experiences
            </Typography>
          </Stack>

          {experiences?.community && experiences.community.length > 0 ? (
            <Box className="place-experiences__carousel">
              {experiences.community.map((exp: any) => {
                const isMeetup = exp.category === 'Meetup';
                return (
                  <Card
                    key={exp.id}
                    className={`place-experiences__card place-experiences__card--filled ${
                      isMeetup ? 'place-experiences__card--meetup' : ''
                    }`}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={exp.coverImage}
                        alt={exp.title}
                      />
                      {isMeetup && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 'var(--spacing-md)',
                            right: 'var(--spacing-md)',
                            backgroundColor: '#ff0000',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            boxShadow: '0 2px 8px rgba(255,0,0,0.4)',
                          }}
                        >
                          MEET-UP
                        </Box>
                      )}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: 'var(--spacing-md)',
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#fff',
                            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          }}
                        >
                          {exp.title}
                        </Typography>
                      </Box>
                    </Box>
                    <CardContent>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'var(--color-accent-main)',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      >
                        {exp.category}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'var(--color-text-secondary)', mt: 1 }}
                      >
                        {exp.description}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          ) : (
            <Card className="place-experiences__card place-experiences__card--empty">
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center',
                }}
              >
                Community experiences coming soon.
              </Typography>
            </Card>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
