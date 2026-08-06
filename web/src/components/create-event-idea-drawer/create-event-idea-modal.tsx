'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Check, Close, Edit } from '@mui/icons-material';
import type { Event } from 'src/lib/types';
import { EventItem } from 'src/app/groups/_components/event-item/event-item';

import './create-event-idea-modal.scss';

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
  title = 'Share your idea',
}: CreateEventIdeaDrawerProps) {
  const [form, setForm] = useState({
    title: '',
    location: '',
    imageUrl: '',
    plannedDate: '',
    time: '',
  });
  const [activeField, setActiveField] = useState<keyof typeof form | null>(
    null,
  );
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    form.title.trim().length > 0 && form.location.trim().length > 0;

  const previewEvent = useMemo<Event>(
    () => ({
      id: '',
      ownerId: groupId,
      title: form.title.trim() || 'Untitled Event Idea',
      location: form.location.trim() || 'Location not specified',
      coverImageUrl:
        form.imageUrl.trim() ||
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop',
      plannedDate: form.plannedDate
        ? new Date(`${form.plannedDate}T00:00:00.000Z`)
        : undefined,
      time: form.time || 'Time not specified',
      stage: 'idea',
      ownerType,
      groupId: ownerType === 'group' ? groupId : undefined,
      createdBy:
        createdBy ??
        (typeof window !== 'undefined'
          ? (window.localStorage.getItem('phoneNumber') ?? undefined)
          : undefined),
      hostName,
      comments: [],
      ratings: [],
      createdAt: new Date().toISOString(),
      metadata: {
        hostAvatarUrl: '/images/avatar.png',
      },
    }),
    [
      createdBy,
      form.imageUrl,
      form.location,
      form.plannedDate,
      form.time,
      form.title,
      groupId,
      hostName,
      ownerType,
    ],
  );

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: '',
      location: '',
      imageUrl: '',
      plannedDate: '',
      time: '',
    });
    setActiveField(null);
    setShowValidation(false);
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setShowValidation(true);
      return;
    }

    const payload: CreateEventIdeaPayload = {
      title: form.title.trim(),
      location: form.location.trim(),
      imageUrl: form.imageUrl.trim() || undefined,
      plannedDate: form.plannedDate || undefined,
      time: form.time || undefined,
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

      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderEditableField = (
    field: keyof typeof form,
    label: string,
    placeholder: string,
    options?: {
      type?: 'text' | 'date' | 'time';
      required?: boolean;
      multiline?: boolean;
      minRows?: number;
      helperText?: string;
      displayValue?: string;
    },
  ) => {
    const isEditing = activeField === field;
    const value = form[field];
    const isRequired = options?.required ?? false;
    const showError =
      showValidation &&
      isRequired &&
      typeof value === 'string' &&
      !value.trim();

    if (isEditing) {
      return (
        <Stack spacing={1.25} className="create-event-idea__field-editor">
          <TextField
            className="create-event-idea__text-field"
            variant="standard"
            label={label}
            value={value}
            type={options?.type ?? 'text'}
            multiline={options?.multiline}
            minRows={options?.minRows}
            onChange={(event) => updateField(field, event.target.value)}
            error={showError}
            helperText={
              showError ? `${label} is required` : (options?.helperText ?? ' ')
            }
            fullWidth
            InputLabelProps={
              options?.type === 'date' || options?.type === 'time'
                ? { shrink: true }
                : undefined
            }
            placeholder={placeholder}
          />
          <Stack
            direction="row"
            spacing={1}
            className="create-event-idea__field-actions"
          >
            <Button
              className="create-event-idea__icon-button"
              size="small"
              variant="text"
              onClick={() => setActiveField(null)}
            >
              <Close fontSize="small" />
            </Button>
            <Button
              className="create-event-idea__icon-button"
              size="small"
              variant="contained"
              onClick={() => setActiveField(null)}
            >
              <Check />
            </Button>
          </Stack>
        </Stack>
      );
    }

    return (
      <Stack
        direction="row"
        spacing={1}
        className="create-event-idea__field-display"
      >
        <Box className="create-event-idea__field-copy">
          <Typography
            variant="caption"
            className="create-event-idea__field-label"
          >
            {label}
          </Typography>
          <Typography
            variant="body2"
            className="create-event-idea__field-value"
          >
            {options?.displayValue || value || placeholder}
          </Typography>
        </Box>
        <Button
          className="create-event-idea__edit-button"
          size="small"
          variant="text"
          startIcon={<Edit fontSize="small" />}
          onClick={() => setActiveField(field)}
        ></Button>
      </Stack>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        className: 'create-event-idea__paper',
      }}
    >
      <Stack spacing={2} className="create-event-idea__content">
        <Stack direction="row" className="create-event-idea__header">
          <Typography variant="h5">{title}</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Stack>

        <Typography variant="body2" className="create-event-idea__description">
          Start with a live event preview. Tap Edit on any field to turn just
          that part into a form.
        </Typography>

        <Box className="create-event-idea__preview">
          <EventItem
            event={previewEvent}
            size="large"
            disableNavigation
            showRating={false}
          />
        </Box>

        <Box className="create-event-idea__fields-pane">
          <Stack spacing={1.25} className="create-event-idea__fields">
            {renderEditableField('title', 'Event name', 'Add a title', {
              required: true,
            })}
            {renderEditableField('location', 'Location', 'Choose a spot', {
              required: true,
            })}
            {renderEditableField('plannedDate', 'Date', 'Pick a date', {
              type: 'date',
              displayValue: form.plannedDate || 'Pick a date',
            })}
            {renderEditableField('time', 'Time', 'Add a time', {
              type: 'time',
              displayValue: form.time || 'Add a time',
            })}
            {renderEditableField('imageUrl', 'Cover image', 'Paste image URL', {
              helperText:
                'Optional. Use a photo URL to update the preview image.',
            })}
          </Stack>
        </Box>

        <Box className="create-event-idea__footer">
          <Button
            className="create-event-idea__submit"
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : `Plan ${form.title || 'Idea'}`}
          </Button>
        </Box>
      </Stack>
    </Dialog>
  );
}
