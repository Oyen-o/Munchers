'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Typography,
  Link,
  Box,
  Stack,
  Avatar,
  AvatarGroup,
  IconButton,
  Button,
  Card,
  TextField,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  Send as SendIcon,
  AccessTime,
} from '@mui/icons-material';
import { Event } from '../../../../lib/types';
import { downloadCalendarEvent } from '../../../../lib/utils';
import {
  WHEN_TO_MEET_DAYS,
  WHEN_TO_MEET_DEFAULT_DAYS,
  isWhenToMeetWeekendDay,
  toEmptyWhenToMeetCounts,
  type WhenToMeetDay,
} from '../../../../lib/availability/when-to-meet-slots';
import {
  useAddEventCommentMutation,
  useEventAvailability,
  useEventCommentsQuery,
  useUpdateEventMutation,
} from '../../_hooks';
import { WhenToMeetGrid, WhenToMeetGridSkeleton } from '../when-to-meet-grid';
import { EventDetailSkeleton } from './event-detail.skeleton';
import './event-detail-page.scss';

interface EventDetailPageProps {
  eventId?: string;
}

// Mock attendees data
const mockAttendees = [
  {
    id: '1',
    name: 'edhamdh',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    attendance: 'Going',
    time: '14:30',
  },
  {
    id: '2',
    name: 'nb23d3',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    attendance: 'Going',
    time: '14:30',
  },
  {
    id: '3',
    name: 'omerrijq499',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    attendance: 'Going',
    time: '14:30',
  },
  {
    id: '4',
    name: 'xueanhuang1023',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    attendance: 'Going',
    time: '14:30',
  },
  {
    id: '5',
    name: 'jennu',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    attendance: 'Going',
    time: '14:30',
  },
  {
    id: '6',
    name: 'sarah_k',
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
    attendance: 'Maybe',
    time: '',
  },
  {
    id: '7',
    name: 'mike_chen',
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
    attendance: 'Maybe',
    time: '',
  },
];

// Mock event data
const mockEvent: Event = {
  id: 'event1',
  title: 'Taco Guild',
  description:
    'Join us for delicious tacos and great conversation at Taco Guild! This is a casual gathering for our group to catch up and enjoy some amazing food together.',
  coverImageUrl:
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=400&fit=crop',
  stage: 'planned',
  ownerId: '1',
  ownerType: 'group',
  createdBy: 'Carina',
  groupId: '1',
  hostId: 'Carina',
  plannedDate: new Date('2026-07-25T18:30:00'),
  location: 'Taco Guild, 123 Main St, Denver, CO',
  comments: [
    {
      id: 'c1',
      eventId: 'event1',
      userId: 'user1',
      content: "Can't wait! Their tacos are amazing!",
      createdAt: new Date('2026-07-20T10:30:00'),
      updatedAt: new Date('2026-07-20T10:30:00'),
    },
    {
      id: 'c2',
      eventId: 'event1',
      userId: 'user2',
      content: 'Should we make a reservation?',
      createdAt: new Date('2026-07-20T11:15:00'),
      updatedAt: new Date('2026-07-20T11:15:00'),
    },
  ],
  ratings: [],
  createdAt: new Date('2026-07-18T12:00:00'),
  updatedAt: new Date('2026-07-20T12:00:00'),
};

export function EventDetailPage({ eventId }: EventDetailPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isEventLoading, setIsEventLoading] = useState(Boolean(eventId));
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(mockEvent.title);
  const [editDescription, setEditDescription] = useState(
    mockEvent.description ?? '',
  );
  const [editLocation, setEditLocation] = useState(
    typeof mockEvent.location === 'string'
      ? mockEvent.location
      : (mockEvent.location?.address ?? ''),
  );
  const [editTime, setEditTime] = useState(mockEvent.time ?? '');
  const [editDate, setEditDate] = useState('');
  const [visibleAvailabilityDays, setVisibleAvailabilityDays] = useState<
    WhenToMeetDay[]
  >([...WHEN_TO_MEET_DEFAULT_DAYS]);

  const currentUserId = useMemo(() => {
    if (typeof window === 'undefined') {
      return 'currentUser';
    }

    return window.localStorage.getItem('phoneNumber') || 'currentUser';
  }, []);

  const commentsQuery = useEventCommentsQuery(eventId);
  const eventAvailability = useEventAvailability(eventId, currentUserId);
  const addCommentMutation = useAddEventCommentMutation();
  const updateEventMutation = useUpdateEventMutation();
  const targetEventId = eventId;

  useEffect(() => {
    if (!eventId) {
      setEvent(mockEvent);
      setIsEventLoading(false);
      return;
    }

    let isCancelled = false;
    setIsEventLoading(true);

    const fetchEventById = async () => {
      try {
        const response = await fetch(
          `/api/events?eventId=${encodeURIComponent(eventId)}`,
        );

        if (!response.ok) {
          throw new Error(`Events API returned ${response.status}`);
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          return;
        }

        const fetchedEvent = data[0] as Partial<Event>;

        if (!isCancelled) {
          const nextEvent = {
            ...mockEvent,
            ...fetchedEvent,
            comments: fetchedEvent.comments ?? [],
            ratings: fetchedEvent.ratings ?? [],
          } as Event;

          setEvent(nextEvent);
          setEditTitle(nextEvent.title);
          setEditDescription(nextEvent.description ?? '');
          setEditLocation(
            typeof nextEvent.location === 'string'
              ? nextEvent.location
              : (nextEvent.location?.address ?? ''),
          );
          setEditTime(nextEvent.time ?? '');
          setEditDate(
            nextEvent.plannedDate
              ? new Date(nextEvent.plannedDate).toISOString().slice(0, 10)
              : '',
          );
          setIsEventLoading(false);
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        if (!isCancelled) {
          setEvent(mockEvent);
          setEditTitle(mockEvent.title);
          setEditDescription(mockEvent.description ?? '');
          setEditLocation(
            typeof mockEvent.location === 'string'
              ? mockEvent.location
              : (mockEvent.location?.address ?? ''),
          );
          setEditTime(mockEvent.time ?? '');
          setEditDate(
            mockEvent.plannedDate
              ? new Date(mockEvent.plannedDate).toISOString().slice(0, 10)
              : '',
          );
          setIsEventLoading(false);
        }
      }
    };

    fetchEventById();

    return () => {
      isCancelled = true;
    };
  }, [eventId]);

  useEffect(() => {
    setEditDate(
      event?.plannedDate
        ? new Date(event.plannedDate).toISOString().slice(0, 10)
        : '',
    );
  }, [event?.plannedDate]);

  const comments =
    commentsQuery.data && commentsQuery.data.length > 0
      ? commentsQuery.data
      : (event?.comments ?? []);

  const handleAddComment = async () => {
    const content = newComment.trim();

    if (!content || !targetEventId) {
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        eventId: targetEventId,
        userId: currentUserId,
        content,
      });
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleToggleAvailabilitySlot = async (
    slot: Parameters<typeof eventAvailability.toggleAvailabilitySlot>[0],
  ) => {
    try {
      await eventAvailability.toggleAvailabilitySlot(slot);
      await eventAvailability.refetchSummary();
    } catch (error) {
      console.error('Error saving availability:', error);
    }
  };

  const handleAddAvailabilityDay = (day: WhenToMeetDay) => {
    setVisibleAvailabilityDays((existing) => {
      if (existing.includes(day)) {
        return existing;
      }

      return [...existing, day];
    });
  };

  const handleRemoveAvailabilityDay = (day: WhenToMeetDay) => {
    if (isWhenToMeetWeekendDay(day)) {
      return;
    }

    setVisibleAvailabilityDays((existing) =>
      existing.filter((existingDay) => existingDay !== day),
    );
  };

  const handleSaveEvent = async () => {
    const title = editTitle?.trim();

    if (!title || !targetEventId) {
      return;
    }

    try {
      const description = editDescription.trim();
      const location = editLocation.trim();
      const time = editTime.trim();

      const parsedPlannedDate = editDate
        ? new Date(`${editDate}T00:00:00.000Z`)
        : undefined;

      const plannedDate =
        parsedPlannedDate && !Number.isNaN(parsedPlannedDate.getTime())
          ? parsedPlannedDate
          : undefined;

      const updatedEvent = await updateEventMutation.mutateAsync({
        id: targetEventId,
        title,
        description: description || undefined,
        location: location || undefined,
        time: time || undefined,
        plannedDate,
      });

      setEvent((previousEvent) => {
        if (!previousEvent) {
          return updatedEvent;
        }

        return {
          ...previousEvent,
          ...updatedEvent,
          comments: previousEvent.comments,
          ratings: previousEvent.ratings,
        };
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleCancelEdit = () => {
    if (!event) {
      setIsEditing(false);
      return;
    }

    setEditTitle(event.title);
    setEditDescription(event.description ?? '');
    setEditLocation(
      typeof event.location === 'string'
        ? event.location
        : (event.location?.address ?? ''),
    );
    setEditTime(event.time ?? '');
    setEditDate(
      event.plannedDate
        ? new Date(event.plannedDate).toISOString().slice(0, 10)
        : '',
    );
    setIsEditing(false);
  };

  const handleDownloadCalendar = () => {
    if (!event?.plannedDate) return;
    downloadCalendarEvent(
      event.title,
      event.plannedDate,
      event.description,
      typeof event.location === 'string'
        ? event.location
        : event.location?.address,
      event.id,
    );
  };

  const locationLabel =
    typeof event?.location === 'string'
      ? event.location.trim()
      : (event?.location?.address ?? '').trim();
  const locationMapUrl = locationLabel
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLabel)}`
    : '';

  const attendees = mockAttendees;

  const eventCountdownText = useMemo(() => {
    const targetDate = editDate
      ? new Date(`${editDate}T00:00:00.000Z`)
      : event?.plannedDate
        ? new Date(event.plannedDate)
        : null;

    if (!targetDate || Number.isNaN(targetDate.getTime())) {
      return '- day(s)';
    }

    const today = new Date();
    const todayUtcStart = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
    );
    const targetUtcStart = Date.UTC(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate(),
    );

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const totalDaysRemaining = Math.max(
      0,
      Math.ceil((targetUtcStart - todayUtcStart) / millisecondsPerDay),
    );

    if (totalDaysRemaining > 14) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(targetDate);
    }

    return `${totalDaysRemaining} day(s)`;
  }, [editDate, event?.plannedDate]);

  const formatMonthLabel = (value?: Date | string) => {
    const safeDate = value ? new Date(value) : null;
    if (!safeDate || Number.isNaN(safeDate.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      timeZone: 'UTC',
    })
      .format(safeDate)
      .toUpperCase();
  };

  const formatDayNumber = (value?: Date | string) => {
    const safeDate = value ? new Date(value) : null;
    if (!safeDate || Number.isNaN(safeDate.getTime())) return '';
    return safeDate.getUTCDate();
  };

  const formatTimeLabel = (value?: Date | string) => {
    const safeDate = value ? new Date(value) : null;
    if (!safeDate || Number.isNaN(safeDate.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    }).format(safeDate);
  };

  const formatCommentTime = (value?: Date | string) => {
    const safeDate = value ? new Date(value) : null;
    if (!safeDate || Number.isNaN(safeDate.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    }).format(safeDate);
  };

  const whenToMeetSelectedDate = useMemo(() => {
    const safeDate = editDate
      ? new Date(`${editDate}T00:00:00.000Z`)
      : event?.plannedDate
        ? new Date(event.plannedDate)
        : null;

    if (!safeDate || Number.isNaN(safeDate.getTime())) {
      return null;
    }

    return safeDate;
  }, [editDate, event?.plannedDate]);

  const whenToMeetWeekendStart = useMemo(() => {
    if (!whenToMeetSelectedDate) {
      return null;
    }

    const weekendStart = new Date(
      Date.UTC(
        whenToMeetSelectedDate.getUTCFullYear(),
        whenToMeetSelectedDate.getUTCMonth(),
        whenToMeetSelectedDate.getUTCDate(),
      ),
    );
    const dayOfWeek = weekendStart.getUTCDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    weekendStart.setUTCDate(weekendStart.getUTCDate() + daysUntilSaturday);

    return weekendStart;
  }, [whenToMeetSelectedDate]);

  const whenToMeetDayLabels = useMemo(() => {
    if (!whenToMeetWeekendStart) {
      return {} as Partial<Record<WhenToMeetDay, string>>;
    }

    const dayOffsetsFromSaturday: Record<WhenToMeetDay, number> = {
      Monday: -5,
      Tuesday: -4,
      Wednesday: -3,
      Thursday: -2,
      Friday: -1,
      Saturday: 0,
      Sunday: 1,
    };

    return WHEN_TO_MEET_DAYS.reduce(
      (acc, day) => {
        const dayDate = new Date(whenToMeetWeekendStart);
        dayDate.setUTCDate(
          whenToMeetWeekendStart.getUTCDate() + dayOffsetsFromSaturday[day],
        );

        const dateLabel = new Intl.DateTimeFormat('en-US', {
          month: 'numeric',
          day: 'numeric',
          timeZone: 'UTC',
        }).format(dayDate);

        acc[day] = `${day} (${dateLabel})`;
        return acc;
      },
      {} as Partial<Record<WhenToMeetDay, string>>,
    );
  }, [whenToMeetWeekendStart]);

  const whenToMeetDateText = (() => {
    if (!whenToMeetWeekendStart) {
      return 'No date selected yet. Select a date to focus this weekend availability.';
    }

    return `Weekend of ${new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(whenToMeetWeekendStart)}`;
  })();

  const isPageLoading =
    isEventLoading ||
    (Boolean(eventId) && commentsQuery.isLoading) ||
    (Boolean(targetEventId) && eventAvailability.isLoading && !event);

  if (isPageLoading || isEventLoading) {
    return (
      <EventDetailSkeleton visibleAvailabilityDays={visibleAvailabilityDays} />
    );
  }

  return (
    <Box className="event-detail-page__container">
      <Stack className="event-detail-page__nav" direction="row">
        <IconButton
          onClick={() => window.history.back()}
          className="event-detail-page__back-button"
        >
          <ArrowBackIcon sx={{ marginRight: '12px' }} />
          Back To Feed
        </IconButton>
      </Stack>
      <Stack className="event-detail-page__stack" gap={3}>
        <Box className="event-detail-page__hero-section">
          {/* Hero Info Card */}
          <Card className="event-detail-page__hero-card">
            <Stack
              className="event-detail-page__card-top"
              direction="row"
              spacing={2}
            >
              <Stack className="event-detail-page__card-top-right">
                <AccessTime
                  sx={{
                    color: 'var(--color-text-primary)',
                    marginRight: '8px',
                    fontSize: '1.5rem',
                  }}
                />
                <Typography
                  className="event-detail-page__page"
                  variant="body1"
                  sx={{
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-md)',
                    fontWeight: 'var(--font-weight-semibold)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {eventCountdownText}
                </Typography>
              </Stack>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              className="event-detail-page__info-stack"
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    height: '90%',
                    borderColor: 'var(--border-color-1)',
                    alignSelf: 'center',
                  }}
                />
              }
            >
              {/* Date Box */}
              <Stack
                className="event-detail-page__date-box"
                onClick={handleDownloadCalendar}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              >
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.9, fontSize: 'var(--font-size-xs)' }}
                >
                  {formatMonthLabel(event?.plannedDate)}
                </Typography>
                <Typography variant="h1">
                  {formatDayNumber(event?.plannedDate)}
                </Typography>
                <Typography
                  className="event-detail-page__inline-link event-detail-page__inline-link--calendar"
                  variant="body2"
                  sx={{ fontSize: 'var(--font-size-xs)', marginTop: '-12px' }}
                >
                  <LinkIcon
                    sx={{
                      fontSize: 'var(--font-size-xs)',

                      verticalAlign: 'text-bottom',
                    }}
                  />
                  download calendar
                </Typography>
              </Stack>

              {/* Event Info */}

              <Stack
                className="event-detail-page__event-info"
                spacing={2}
                gap={1.5}
              >
                {event?.plannedDate && (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <CalendarIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
                      {formatTimeLabel(event?.plannedDate)}
                    </Typography>
                  </Stack>
                )}

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <LocationIcon sx={{ color: '#fff', fontSize: 18 }} />
                  {locationMapUrl ? (
                    <Link
                      href={locationMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="body2"
                      className="event-detail-page__inline-link"
                      underline="always"
                      sx={{ fontSize: '0.95rem' }}
                    >
                      {locationLabel}
                    </Link>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: '#fff', fontSize: '0.95rem' }}
                    >
                      Location not specified
                    </Typography>
                  )}
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <PersonIcon sx={{ color: '#fff', fontSize: 18 }} />
                  <Typography
                    variant="body2"
                    sx={{ color: '#fff', opacity: 0.9, fontSize: '0.95rem' }}
                  >
                    {attendees.length} Attendees
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Box className="event-detail-page__title">
              <Typography variant="h3">{event?.title}</Typography>
            </Box>
          </Card>

          {/* Join Button - Overlapping */}
          <Box
            className="event-detail-page__rsvp-button-container"
            sx={{
              position: 'relative',
              zIndex: 10,
              marginTop: '-28px !important',
              marginBottom: '-28px',
              padding: '0 var(--spacing-lg)',
            }}
          >
            <Button
              variant="contained"
              fullWidth
              className="event-detail-page__rsvp-button"
            >
              Join
            </Button>
          </Box>
        </Box>

        {/* Event Description */}
        <Card
          className={`event-detail-page__description-card event-detail-page__paper ${isEditing ? 'event-detail-page__description-card--edit' : ''}`}
        >
          {isEditing ? (
            <Stack spacing={2}>
              <TextField
                label="Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                size="small"
              />
              <TextField
                label="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                size="small"
                multiline
                minRows={2}
                maxRows={4}
              />
              <TextField
                label="Location"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                size="small"
              />
              <TextField
                label="Time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                size="small"
              />
              <TextField
                label="Date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Stack>
          ) : (
            <Typography
              variant="body1"
              sx={{ color: 'var(--color-text-secondary)' }}
            >
              {event?.description || 'No description yet.'}
            </Typography>
          )}

          <Stack
            direction="row"
            className="event-detail-page__description-bottom"
            spacing={3}
            sx={{
              justifyContent: isEditing ? 'space-between' : 'space-around',
            }}
          >
            {!isEditing ? (
              <Button
                className="event-detail-page__edit-button"
                variant="contained"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  className="event-detail-page__cancel-button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  className="event-detail-page__save-button"
                  variant="contained"
                  onClick={() => void handleSaveEvent()}
                  disabled={!editTitle.trim() || updateEventMutation.isPending}
                >
                  Save
                </Button>
              </>
            )}
          </Stack>
        </Card>

        {/* Event Image */}
        {event?.coverImageUrl && (
          <Box className="event-detail-page__image">
            <img src={event?.coverImageUrl} alt={event?.title} />
          </Box>
        )}

        <Card className="event-detail-page__when-to-meet-card event-detail-page__paper">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            When to Meet
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'var(--color-text-secondary)', mb: 1.5 }}
          >
            {whenToMeetDateText}
          </Typography>
          {eventAvailability.isLoading ? (
            <WhenToMeetGridSkeleton
              visibleDays={visibleAvailabilityDays}
              dayLabels={whenToMeetDayLabels}
            />
          ) : (
            <WhenToMeetGrid
              selectedSlots={eventAvailability.selectedSlots}
              counts={eventAvailability.counts ?? toEmptyWhenToMeetCounts()}
              totalResponses={eventAvailability.totalResponses}
              visibleDays={visibleAvailabilityDays}
              dayLabels={whenToMeetDayLabels}
              onAddDay={handleAddAvailabilityDay}
              onRemoveDay={handleRemoveAvailabilityDay}
              onToggle={(slot) => {
                void handleToggleAvailabilitySlot(slot);
              }}
            />
          )}
        </Card>

        {/* Attendees List */}
        <Card className="event-detail-page__attendees-card event-detail-page__paper">
          <Typography
            variant="body2"
            sx={{ color: 'var(--color-text-secondary)', mb: 1.5 }}
          >
            Attendees ({attendees.length})
          </Typography>
          <AvatarGroup
            max={20}
            className="event-detail-page__attendee-avatars"
            sx={{ justifyContent: 'flex-end' }}
          >
            {attendees.map((attendee) => (
              <Avatar
                key={attendee.id}
                src={attendee.avatarUrl}
                alt={attendee.name}
              />
            ))}
          </AvatarGroup>
          {/* <List className="event-detail-page__attendees-list">
            {attendees.map((attendee) => (
              <ListItem
                key={attendee.id}
                className="event-detail-page__attendee-item"
              >
                <ListItemAvatar>
                  <Avatar src={attendee.avatarUrl} alt={attendee.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={attendee.name}
                  secondary={attendee.time}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: '0.9rem',
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                  }}
                />
              </ListItem>
            ))}
          </List> */}
        </Card>

        {/* Comments Section */}
        <Card className="event-detail-page__comments-card event-detail-page__paper">
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Comments ({comments.length})
          </Typography>

          <Stack spacing={2} sx={{ mb: 2 }}>
            {comments.map((comment) => (
              <Box key={comment.id} className="event-detail-page__comment">
                <Stack direction="row" spacing={1.5}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: 'var(--color-primary-main)',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      User {comment.userId}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'var(--color-text-secondary)', mb: 0.5 }}
                    >
                      {comment.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'var(--color-text-disabled)' }}
                    >
                      {formatCommentTime(comment.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>

          {/* Add Comment */}
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleAddComment()}
              size="small"
            />
            <IconButton
              onClick={() => void handleAddComment()}
              disabled={!newComment.trim() || addCommentMutation.isPending}
              sx={{
                backgroundColor: 'var(--color-primary-main)',
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-dark)',
                },
                '&:disabled': {
                  backgroundColor: 'var(--color-text-disabled)',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
