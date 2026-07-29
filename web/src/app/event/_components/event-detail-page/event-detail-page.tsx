'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Stack,
  Avatar,
  Chip,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  TextField,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { Event, Comment } from '../../../../lib/types';
import { downloadCalendarEvent } from '../../../../lib/utils';
import './event-detail-page.scss';

interface EventDetailPageProps {
  eventId: string;
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
  title: 'Taco Guild Meetup',
  description:
    'Join us for delicious tacos and great conversation at Taco Guild! This is a casual gathering for our group to catch up and enjoy some amazing food together.',
  imageUrl:
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
  const [event, setEvent] = useState<Event>(mockEvent);
  const [attendees, setAttendees] = useState(mockAttendees);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${event.comments.length + 1}`,
      eventId: event.id,
      userId: 'currentUser',
      content: newComment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setEvent({
      ...event,
      comments: [...event.comments, comment],
    });
    setNewComment('');
  };

  const handleDownloadCalendar = () => {
    if (!event.plannedDate) return;
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

  const goingCount = attendees.filter((a) => a.attendance === 'Going').length;
  const maybeCount = attendees.filter((a) => a.attendance === 'Maybe').length;

  const formatDateLabel = (value?: Date | string) => {
    const safeDate = value ? new Date(value) : null;
    if (!safeDate || Number.isNaN(safeDate.getTime())) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(safeDate);
  };

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
      <Stack className="event-detail-page__stack" spacing={3}>
        {/* Hero Info Card */}
        <Card className="event-detail-page__hero-card">
          <Stack
            className="event-detail-page__card-top"
            direction="row"
            spacing={2}
          >
            <Stack className="event-detail-page__card-top-right">
              <CalendarIcon
                sx={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-md)',
                }}
              />
              <Typography
                className="event-detail-page__page"
                variant="body2"
                sx={{ color: 'var(--color-text-primary)' }}
              >
                {formatDateLabel(event.plannedDate)}
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '180px',
              padding: '0 var(--spacing-md)',
            }}
            divider={
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  height: '60%',
                  borderColor: 'var(--border-color-1)',
                  alignSelf: 'center',
                }}
              />
            }
          >
            {/* Date Box */}
            <Box
              className="event-detail-page__date-box"
              onClick={handleDownloadCalendar}
              sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
            >
              <Typography
                variant="caption"
                sx={{ opacity: 0.9, fontSize: '0.7rem' }}
              >
                {formatMonthLabel(event.plannedDate)}
              </Typography>
              <Typography variant="h1">
                {formatDayNumber(event.plannedDate)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: '.4rem', marginTop: '-16px' }}
              >
                download calendar
              </Typography>
            </Box>

            {/* Event Info */}

            <Stack className="event-detail-page__event-info" spacing={2}>
              {event.plannedDate && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <CalendarIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {formatTimeLabel(event.plannedDate)}
                  </Typography>
                </Stack>
              )}

              {
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <LocationIcon sx={{ color: '#fff', fontSize: 16 }} />
                  <Typography
                    variant="caption"
                    sx={{ color: '#fff', opacity: 0.9 }}
                  >
                    {event.location && event.location.valueOf() !== ''
                      ? typeof event.location === 'string'
                        ? event.location
                        : event.location?.address
                      : 'Location not specified'}
                  </Typography>
                </Stack>
              }

              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <PersonIcon sx={{ color: '#fff', fontSize: 16 }} />
                <Typography
                  variant="caption"
                  sx={{ color: '#fff', opacity: 0.9 }}
                >
                  {attendees.length} Attendees
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Box className="event-detail-page__title">
            <Typography variant="h3">{event.title}</Typography>
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

        {/* Event Description */}
        {event.description && (
          <Card className="event-detail-page__description-card">
            <Typography
              variant="body1"
              sx={{ color: 'var(--color-text-secondary)' }}
            >
              {event.description}
            </Typography>
          </Card>
        )}

        {/* Event Image */}
        <Box className="event-detail-page__image">
          <img src={event.imageUrl} alt={event.title} />
          <Chip
            label={event.stage}
            className="event-detail-page__stage-badge"
            sx={{
              backgroundColor: 'var(--color-stage-' + event.stage + ')',
            }}
          />
        </Box>

        {/* Attendees List */}
        <Card className="event-detail-page__attendees-card">
          <Typography
            variant="body2"
            sx={{ color: 'var(--color-text-secondary)', mb: 1.5 }}
          >
            Attendees of the meeting ({attendees.length} total)
          </Typography>
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
        <Card className="event-detail-page__comments-card">
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Comments ({event.comments.length})
          </Typography>

          <Stack spacing={2} sx={{ mb: 2 }}>
            {event.comments.map((comment) => (
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
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              size="small"
            />
            <IconButton
              onClick={handleAddComment}
              disabled={!newComment.trim()}
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
