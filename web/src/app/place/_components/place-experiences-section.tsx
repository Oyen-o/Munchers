'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { ExternalProviderBadge } from '../../../components/external-provider-badge';
import {
  getProviderConfig,
  type ExperienceProvider,
} from '../../../lib/providers/provider-config';

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
        logoUrl: '/logos/az-sport-league.png',
        brandId: 'az-sport-league', // ID for brand page navigation
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
          'https://media.istockphoto.com/id/1217070875/photo/silhouette-of-beach-volleyball-player-on-the-beach.jpg?s=612x612&w=0&k=20&c=pp32lsImCnMZoHvcbQnOmzWrYg_-gHNKIrEkwlc9agw=',
        provider: 'meetup' as ExperienceProvider,
        externalUrl: 'https://meetup.com/example-event',
      },
      {
        id: 'exp2',
        title: 'Tournament Weekend',
        category: 'Competition',
        description:
          'Weekend tournaments with multiple courts, vendors, spectators, and championship matches.',
        coverImage:
          'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=250&fit=crop',
        provider: 'partiful' as ExperienceProvider,
        externalUrl: 'https://partiful.com/example-event',
      },
      {
        id: 'exp3',
        title: 'Beginner Open Play',
        category: 'Learning',
        description:
          'Perfect for learning rotations, serving, and basic gameplay with experienced players.',
        coverImage:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ322ZFapAQFmkj8q1G1xRNGpiC1NwVw-bEKSsU1G9QUA&s=612x612',
      },
      {
        id: 'exp4',
        title: 'Friday Sunset Games',
        category: 'Social',
        description:
          'One of the most popular recurring volleyball nights at this park.',
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

  const handleBrandClick = (brandId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    router.push(`/brand/${brandId}`);
  };

  const handleExternalLink = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
                    {exp.logoUrl && exp.brandId && (
                      <Box
                        onClick={(e) => handleBrandClick(exp.brandId, e)}
                        sx={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          padding: '10px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          '&:hover': {
                            transform: 'scale(1.08)',
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                          },
                          '&:active': {
                            transform: 'scale(1.02)',
                          },
                        }}
                        title="View brand page"
                      >
                        <img
                          src={exp.logoUrl}
                          alt="Official logo"
                          style={{
                            width: 48,
                            height: 48,
                            display: 'block',
                            pointerEvents: 'none',
                          }}
                        />
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
                        variant="caption"
                        sx={{
                          fontFamily: 'goldman',
                          background:
                            'linear-gradient(135deg, #C0C0C0 0%, #808080 50%, #2C2C2C 100%)',
                          color: '#fff',
                          textTransform: 'uppercase',
                          fontWeight: 800,
                          fontSize: '0.65rem',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          letterSpacing: '1px',
                          boxShadow:
                            '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          display: 'inline-block',
                          mb: 1,
                        }}
                      >
                        {exp.badge || 'Official'}
                      </Typography>
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
                        color: 'var(--color-text-secondary)',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        display: 'block',
                        mb: 1,
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
                const providerConfig = getProviderConfig(exp.provider);
                const hasProvider = !!exp.provider;

                return (
                  <Card
                    key={exp.id}
                    className={`place-experiences__card place-experiences__card--filled ${
                      isMeetup ? 'place-experiences__card--meetup' : ''
                    }`}
                    sx={{
                      ...(providerConfig && {
                        borderLeft: `4px solid ${providerConfig.colors.primary}`,
                      }),
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={exp.coverImage}
                        alt={exp.title}
                      />

                      {/* Provider Badge (replaces brand logo position) */}
                      {exp.provider && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                          }}
                        >
                          <ExternalProviderBadge
                            provider={exp.provider}
                            size="medium"
                            onClick={
                              exp.externalUrl
                                ? (e) => handleExternalLink(exp.externalUrl, e)
                                : undefined
                            }
                          />
                        </Box>
                      )}

                      {/* Meetup badge (for backward compatibility) */}
                      {isMeetup && !exp.provider && (
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
                          color: hasProvider
                            ? providerConfig?.colors.accent
                            : 'var(--color-accent-main)',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          fontSize: 'var(--font-size-lg)',
                          display: 'block',
                          mb: 1,
                        }}
                      >
                        {exp.category}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'var(--color-text-secondary)', mb: 2 }}
                      >
                        {exp.description}
                      </Typography>

                      {/* Hosted on Provider chip */}
                      {hasProvider && providerConfig && (
                        <Chip
                          onClick={(e) =>
                            handleExternalLink(exp.externalUrl, e)
                          }
                          icon={<OpenInNewIcon sx={{ fontSize: '0.9rem' }} />}
                          label={` ${providerConfig.displayName}`}
                          size="small"
                          sx={{
                            mb: 1.5,
                            backgroundColor: providerConfig.colors.background,
                            color: providerConfig.colors.primary,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            border: `1px solid ${providerConfig.colors.primary}40`,
                            '& .MuiChip-icon': {
                              color: providerConfig.colors.primary,
                            },
                          }}
                        />
                      )}
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
