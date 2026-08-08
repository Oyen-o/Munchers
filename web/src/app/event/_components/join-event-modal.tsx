'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import {
  Close,
  CalendarToday,
  LocationOn,
  AccessTime,
  Download,
} from '@mui/icons-material';
import { openCalendarEventByBrowser } from '../../../lib/utils';

import {
  WHEN_TO_MEET_DEFAULT_DAYS,
  toEmptyWhenToMeetCounts,
  type WhenToMeetDay,
} from '../../../lib/availability/when-to-meet-slots';
import { useEventAvailability } from '../../event/_hooks/use-event-availability';
import { Event } from '../../../lib/types';
import { WhenToMeetGrid } from './when-to-meet-grid';
import './join-event-modal.scss';

type JoinEventModalProps = {
  open: boolean;
  onClose: () => void;
  event: Event;
  currentUserId?: string;
  onSuccess?: () => void;
};

export function JoinEventModal({
  open,
  onClose,
  event,
  currentUserId,
  onSuccess,
}: JoinEventModalProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [isCheckingAttendance, setIsCheckingAttendance] = useState(true);
  const [visibleAvailabilityDays, setVisibleAvailabilityDays] = useState<
    WhenToMeetDay[]
  >([...WHEN_TO_MEET_DEFAULT_DAYS]);

  const eventAvailability = useEventAvailability(event.id, currentUserId);

  // Check if user is already attending when modal opens
  useEffect(() => {
    if (!open || !currentUserId) {
      setIsCheckingAttendance(false);
      return;
    }

    const checkAttendance = async () => {
      setIsCheckingAttendance(true);
      try {
        const response = await fetch(`/api/events/${event.id}/attendees`);
        if (response.ok) {
          const data = await response.json();
          const isAttending = data.attendeeIds?.includes(currentUserId);
          setHasJoined(isAttending);
        }
      } catch (error) {
        console.error('Error checking attendance:', error);
      } finally {
        setIsCheckingAttendance(false);
      }
    };

    checkAttendance();
  }, [open, event.id, currentUserId]);

  const handleJoinEvent = async () => {
    if (!currentUserId) {
      console.error('User not logged in');
      return;
    }

    setIsJoining(true);
    try {
      const response = await fetch(`/api/events/${event.id}/attendees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (response.ok) {
        setHasJoined(true);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error joining event:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleDownloadCalendar = () => {
    if (!event.plannedDate) return;

    const plannedDate = new Date(event.plannedDate);
    if (Number.isNaN(plannedDate.getTime())) {
      return;
    }

    const location =
      typeof event.location === 'string'
        ? event.location
        : event.location?.address;

    openCalendarEventByBrowser({
      title: event.title,
      plannedDate,
      description: event.description,
      location,
      eventId: event.id,
    });
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
      if (existing.includes(day)) return existing;
      return [...existing, day].sort((a, b) => {
        const order = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        return order.indexOf(a) - order.indexOf(b);
      });
    });
  };

  const handleRemoveAvailabilityDay = (day: WhenToMeetDay) => {
    if (visibleAvailabilityDays.length <= 1) return;
    setVisibleAvailabilityDays((existing) => existing.filter((d) => d !== day));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Time TBD';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="join-event-modal__container"
      slotProps={{
        paper: { className: 'join-event-modal__dialog-paper ' },
      }}
    >
      <DialogContent sx={{ p: 0 }} className="parallax-wrapper">
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          className="join-event-modal__close-button"
        >
          <Close />
        </IconButton>

        {/* Event Image with Title Overlay */}
        {event.coverImageUrl && (
          <Box className="parallax-group ">
            <Box className="join-event-modal__image-container parallax-layer layer-back">
              <Box
                className="join-event-modal__event-image"
                sx={{
                  backgroundImage: `url(${event.coverImageUrl})`,
                }}
                role="img"
                aria-label={event.title}
              />
            </Box>

            <Box className="join-event-modal__image-overlay parallax-layer layer-base">
              <Typography
                variant="h3"
                className="join-event-modal__title-overlay"
              >
                {event.title}
              </Typography>
            </Box>
          </Box>
        )}

        <Box className="join-event-modal__content static-section ">
          {/* Event Details */}
          <Stack className="join-event-modal__details-stack">
            <Box>
              {event.description && (
                <Typography
                  variant="body1"
                  className="join-event-modal__description"
                >
                  {event.description}
                </Typography>
              )}
            </Box>

            {/* Date & Time */}
            <Stack className="join-event-modal__date-time-stack">
              {event.plannedDate && (
                <>
                  <Stack className="join-event-modal__detail-row">
                    <CalendarToday className="join-event-modal__detail-icon" />
                    <Typography variant="body1">
                      {formatDate(event.plannedDate.toString())}
                    </Typography>
                  </Stack>

                  <Stack className="join-event-modal__detail-row">
                    <AccessTime className="join-event-modal__detail-icon" />
                    <Typography variant="body1">
                      {formatTime(event.plannedDate.toString())}
                    </Typography>
                  </Stack>
                </>
              )}

              {event.location && (
                <Stack className="join-event-modal__detail-row">
                  <LocationOn className="join-event-modal__detail-icon" />
                  <Typography variant="body1">
                    {typeof event.location === 'string'
                      ? event.location
                      : event.location.address}
                  </Typography>
                </Stack>
              )}
            </Stack>

            <Divider className="join-event-modal__divider" />

            {/* RSVP Confirmation */}
            {isCheckingAttendance ? (
              <Box className="join-event-modal__loading-container">
                <CircularProgress size={32} />
              </Box>
            ) : !hasJoined ? (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleJoinEvent}
                disabled={isJoining}
                className="join-event-modal__join-button"
              >
                {isJoining ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Join Event'
                )}
              </Button>
            ) : (
              <Card className="join-event-modal__going-card">
                <Typography
                  variant="h6"
                  className="join-event-modal__going-text"
                >
                  ✓ You're Going!
                </Typography>
              </Card>
            )}

            {hasJoined && (
              <>
                <Divider className="join-event-modal__divider" />

                {/* Calendar Download Section */}
                <Card className="join-event-modal__calendar-card">
                  <Stack className="join-event-modal__availability-content">
                    <Stack className="join-event-modal__card-header">
                      <Download className="join-event-modal__card-icon" />
                      <Typography
                        variant="h6"
                        className="join-event-modal__card-title"
                      >
                        Add to Calendar
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      className="join-event-modal__card-description"
                    >
                      Don't miss out! Add this event to your calendar.
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleDownloadCalendar}
                      className="join-event-modal__calendar-button"
                    >
                      Download Calendar Event
                    </Button>
                  </Stack>
                </Card>

                <Divider className="join-event-modal__divider" />

                {/* Availability Section */}
                <Card className="join-event-modal__availability-card">
                  <Stack className="join-event-modal__availability-content">
                    <Typography
                      variant="h6"
                      className="join-event-modal__card-title"
                    >
                      Share Your Availability
                    </Typography>
                    <Typography
                      variant="body2"
                      className="join-event-modal__card-description"
                    >
                      Help the group find the best time by marking when you're
                      available.
                    </Typography>

                    {eventAvailability.isLoading ? (
                      <CircularProgress size={32} />
                    ) : (
                      <WhenToMeetGrid
                        selectedSlots={eventAvailability.selectedSlots}
                        counts={
                          eventAvailability.counts ?? toEmptyWhenToMeetCounts()
                        }
                        totalResponses={eventAvailability.totalResponses}
                        visibleDays={visibleAvailabilityDays}
                        onAddDay={handleAddAvailabilityDay}
                        onRemoveDay={handleRemoveAvailabilityDay}
                        onToggle={(slot) => {
                          void handleToggleAvailabilitySlot(slot);
                        }}
                      />
                    )}
                  </Stack>
                </Card>
              </>
            )}
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
