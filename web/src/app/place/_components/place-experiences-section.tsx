'use client';

import { useParams, useRouter } from 'next/navigation';
import { Box, Card, Stack, Typography } from '@mui/material';
import {
  ExperienceItem,
  type Experience,
} from '../../../components/experience-item';
import type { ExperienceProvider } from '../../../lib/providers/provider-config';

import './place-experiences-section.scss';

// Mock experiences data
const experiencesByPlace: Record<string, any> = {
  '2': {
    official: [
      {
        id: 'official-exp1',
        title: 'Scottsdale Open',
        category: 'Official Tournament',
        date: 'March 15-17, 2026',
        coverImage:
          'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=250&fit=crop',
        badge: 'Official',
        logoUrl: '/logos/az-sport-league.png',
        brandId: 'az-sport-league', // ID for brand page navigation
      },
    ],
    community: [
      {
        id: 'exp1',
        title: 'Morning Volleyball Meetup',
        category: 'Meetup',
        date: 'Every Saturday, 8:00 AM',
        coverImage:
          'https://media.istockphoto.com/id/1217070875/photo/silhouette-of-beach-volleyball-player-on-the-beach.jpg?s=612x612&w=0&k=20&c=pp32lsImCnMZoHvcbQnOmzWrYg_-gHNKIrEkwlc9agw=',
        provider: 'meetup' as ExperienceProvider,
        externalUrl: 'https://meetup.com/example-event',
      },
      {
        id: 'exp2',
        title: 'Tournament Weekend',
        category: 'Competition',
        date: 'August 24-25, 2026',
        coverImage:
          'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=250&fit=crop',
        provider: 'partiful' as ExperienceProvider,
        externalUrl: 'https://partiful.com/example-event',
      },
      {
        id: 'exp3',
        title: 'Beginner Open Play',
        category: 'Learning',
        date: 'Wednesdays, 6:00 PM',
        coverImage:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ322ZFapAQFmkj8q1G1xRNGpiC1NwVw-bEKSsU1G9QUA&s=612x612',
      },
      {
        id: 'exp4',
        title: 'Friday Sunset Games',
        category: 'Social',
        date: 'Every Friday, 5:30 PM',
        coverImage:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Jm5scD1doXer_wA8Io_y9gtuoc0bPI5E0-XhulPqfQ&s=10',
        provider: 'sweatpals' as ExperienceProvider,
        externalUrl: 'https://sweatpals.com/example-event',
      },
    ],
  },
};

export function PlaceExperiencesSection() {
  const params = useParams();
  const router = useRouter();
  const placeId = params?.id as string;
  const experiences = experiencesByPlace[placeId];

  return (
    <Box className="place-experiences">
      <Typography variant="h5" className="place-experiences__title">
        Experiences
      </Typography>
      <Typography variant="body2" className="place-experiences__subtitle">
        Discover official and community experiences at this place
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
              {experiences.official.map((exp: Experience) => (
                <ExperienceItem
                  key={exp.id}
                  experience={exp}
                  variant="official"
                  onBrandClick={(brandId) => router.push(`/brand/${brandId}`)}
                />
              ))}
            </Box>
          ) : (
            <Card className="place-experiences__card place-experiences__card--empty">
              <Typography variant="body2" className="experience-item__empty">
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
              {experiences.community.map((exp: Experience) => (
                <ExperienceItem
                  key={exp.id}
                  experience={exp}
                  variant="default"
                  onExternalClick={(url) =>
                    window.open(url, '_blank', 'noopener,noreferrer')
                  }
                />
              ))}
            </Box>
          ) : (
            <Card className="place-experiences__card place-experiences__card--empty">
              <Typography variant="body2" className="experience-item__empty">
                Community experiences coming soon.
              </Typography>
            </Card>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
