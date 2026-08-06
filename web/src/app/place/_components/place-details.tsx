'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  BookmarkBorder,
  Share,
  Add,
  Phone,
  Language,
  LocationOn,
} from '@mui/icons-material';
import type { Place, PlaceCommunityRatings } from 'src/lib/types';
import { getRatingImage } from 'src/lib/utils';

import './place-details.scss';
import { CreatePlanModal } from './create-plan-modal';
import { PlaceExperiencesSection } from './place-experiences-section';
import { PlacePlansSection } from './place-plans-section';
import { PlaceRatingsSection } from './place-ratings-section';

type PlaceDetailsProps = {
  placeId: string;
};

export function PlaceDetails({ placeId }: PlaceDetailsProps) {
  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUserId(window.localStorage.getItem('phoneNumber'));
    }
  }, []);

  // Fetch place details
  const placeQuery = useQuery<Place, Error>({
    queryKey: ['place', placeId],
    enabled: Boolean(placeId),
    queryFn: async () => {
      const response = await fetch(`/api/places/${placeId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch place`);
      }
      return response.json();
    },
  });

  // Fetch community ratings
  const ratingsQuery = useQuery<PlaceCommunityRatings, Error>({
    queryKey: ['place-ratings', placeId, currentUserId],
    enabled: Boolean(placeId && currentUserId),
    queryFn: async () => {
      const response = await fetch(
        `/api/places/${placeId}/ratings?userId=${currentUserId}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch ratings`);
      }
      return response.json();
    },
  });

  // Fetch plans
  const plansQuery = useQuery<any[], Error>({
    queryKey: ['place-plans', placeId],
    enabled: Boolean(placeId),
    queryFn: async () => {
      const response = await fetch(`/api/places/${placeId}/plans`);
      if (!response.ok) {
        throw new Error(`Failed to fetch plans`);
      }
      return response.json();
    },
  });

  if (placeQuery.isLoading) {
    return (
      <Box className="place-details__loading">
        <CircularProgress size={64} />
      </Box>
    );
  }

  if (placeQuery.isError || !placeQuery.data) {
    return (
      <Box className="place-details__loading">
        <Typography variant="h6">Unable to load place details.</Typography>
      </Box>
    );
  }

  const place = placeQuery.data;

  return (
    <Box className="place-details">
      {/* Hero Header */}
      <Box className="place-details__hero">
        <img
          className="place-details__hero-image"
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop"
          alt={place.name}
        />
        <Box className="place-details__hero-gradient" />

        <Stack className="place-details__hero-overlay">
          <IconButton
            className="place-details__back"
            onClick={() => window.history.back()}
          >
            <ArrowBack />
          </IconButton>

          <Box className="place-details__hero-info">
            <Typography variant="h3" className="place-details__title">
              {place.name}
            </Typography>
            <Typography variant="subtitle1" className="place-details__category">
              {place.category}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Place Info Bar */}
      <Stack className="place-details__info-bar" spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <LocationOn fontSize="small" />
          <Typography variant="body2">{place.address}</Typography>
        </Stack>

        {/* Friends Rating */}
        {ratingsQuery.data?.friends && ratingsQuery.data.friends.count > 0 && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', mt: 1 }}
            className="place-details__friends-rating"
          >
            <img
              src={getRatingImage(ratingsQuery.data.friends.average)}
              alt="star"
              style={{ width: 63, height: 63 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1 }}>
              {ratingsQuery.data.friends.average.toFixed(1)}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'var(--color-text-secondary)' }}
            >
              ({ratingsQuery.data.friends.count}{' '}
              {ratingsQuery.data.friends.count === 1 ? 'friend' : 'friends'})
            </Typography>
          </Stack>
        )}

        <Stack direction="row" spacing={1} className="place-details__actions">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreatePlanOpen(true)}
            className="place-details__primary-action"
          >
            Plan
          </Button>
          <IconButton size="small">
            <BookmarkBorder />
          </IconButton>
          <IconButton size="small">
            <Share />
          </IconButton>
        </Stack>
      </Stack>

      {/* Quick Info */}
      {(place.phone || place.website) && (
        <Stack className="place-details__quick-info" spacing={1}>
          {place.phone && (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Phone fontSize="small" />
              <Typography variant="body2">{place.phone}</Typography>
            </Stack>
          )}
          {place.website && (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Language fontSize="small" />
              <Typography
                variant="body2"
                component="a"
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                Website
              </Typography>
            </Stack>
          )}
        </Stack>
      )}

      {/* Experiences Section */}
      <PlaceExperiencesSection />

      {/* Community Ratings Section */}
      <PlaceRatingsSection
        ratings={ratingsQuery.data}
        loading={ratingsQuery.isLoading}
      />

      {/* Plans Section */}
      <PlacePlansSection
        plans={plansQuery.data || []}
        loading={plansQuery.isLoading}
        onCreatePlan={() => setCreatePlanOpen(true)}
      />

      {/* Create Plan Modal */}
      <CreatePlanModal
        open={createPlanOpen}
        onClose={() => setCreatePlanOpen(false)}
        placeId={placeId}
        placeName={place.name}
        onCreated={async () => {
          await plansQuery.refetch();
        }}
      />
    </Box>
  );
}
