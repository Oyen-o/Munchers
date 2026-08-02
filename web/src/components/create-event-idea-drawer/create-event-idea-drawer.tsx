'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';

export type CreateEventIdeaPayload = {
  title: string;
  location: string;
  imageUrl?: string;
  plannedDate?: string;
  time?: string;
};

type CreateEventIdeaDrawerProps = {
  open: boolean;
  onClose: () => void;
  groupId: string;
  hostName?: string;
  createdBy?: string;
  ownerType?: 'group' | 'user';
  onCreated?: (payload: CreateEventIdeaPayload) => Promise<void> | void;
  title?: string;
};

export function CreateEventIdeaDrawer({
  open,
  onClose,
  groupId,
  hostName,
  createdBy,
  ownerType = 'group',
  onCreated,
  title = 'Create Event Idea',
}: CreateEventIdeaDrawerProps) {
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    eventName.trim().length > 0 && eventLocation.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setShowValidation(true);
      return;
    }

    const payload: CreateEventIdeaPayload = {
      title: eventName.trim(),
      location: eventLocation.trim(),
      imageUrl: eventImageUrl.trim() || undefined,
      plannedDate: eventDate || undefined,
      time: eventTime || undefined,
    };

    const resolvedCreatedBy =
      createdBy ?? window.localStorage.getItem('phoneNumber') ?? '';

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: payload.title,
          location: payload.location,
          coverImageUrl: payload.imageUrl,
          plannedDate: payload.plannedDate
            ? new Date(`${payload.plannedDate}T00:00:00.000Z`).toISOString()
            : undefined,
          time: payload.time,
          ownerId: groupId,
          ownerType,
          groupId: ownerType === 'group' ? groupId : undefined,
          stage: 'idea',
          createdBy: resolvedCreatedBy,
          hostName,
          partitionKey: `owner_${groupId}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Events API returned ${response.status}`);
      }

      if (onCreated) {
        await onCreated(payload);
      }

      onClose();
    } finally {
      setIsSubmitting(false);
    }

    setEventName('');
    setEventLocation('');
    setEventImageUrl('');
    setEventDate('');
    setEventTime('');
    setShowValidation(false);
  };

  const handleClose = () => {
    setShowValidation(false);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      anchor="bottom"
      PaperProps={{
        sx: {
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          borderRadius: 0,
          backgroundColor: 'var(--color-light-background-2)',
        },
      }}
    >
      <Stack spacing={2} sx={{ p: 3, height: '100%' }}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography variant="h5">{title}</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>

        <Typography
          variant="body2"
          sx={{ color: 'var(--color-text-secondary)' }}
        >
          Name and location are required.
        </Typography>

        <TextField
          label="Event name"
          value={eventName}
          onChange={(event) => setEventName(event.target.value)}
          error={showValidation && eventName.trim().length === 0}
          helperText={
            showValidation && eventName.trim().length === 0
              ? 'Event name is required'
              : ' '
          }
          fullWidth
        />

        <TextField
          label="Location"
          value={eventLocation}
          onChange={(event) => setEventLocation(event.target.value)}
          error={showValidation && eventLocation.trim().length === 0}
          helperText={
            showValidation && eventLocation.trim().length === 0
              ? 'Location is required'
              : ' '
          }
          fullWidth
        />

        <TextField
          label="Image URL"
          value={eventImageUrl}
          onChange={(event) => setEventImageUrl(event.target.value)}
          fullWidth
        />

        <TextField
          label="Date"
          type="date"
          value={eventDate}
          onChange={(event) => setEventDate(event.target.value)}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Time"
          type="time"
          value={eventTime}
          onChange={(event) => setEventTime(event.target.value)}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Box sx={{ mt: 'auto' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Idea'}
          </Button>
        </Box>
      </Stack>
    </Drawer>
  );
}
