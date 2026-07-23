import React, { useState } from 'react';
import { shortFormat } from '../../../../lib/utils';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Stack,
} from '@mui/material';

import {
  Add as AddIcon,
  FilterList as FilterIcon,
  People as PeopleIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  ViewList as ViewListIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  ArrowBack,
  Face2,
} from '@mui/icons-material';
import { Event, EventStage, Group } from '../../../../lib/types';

import RatingStars from '../ratings/rating';

import '../groups-page/groups-page.scss';
import './event-list.scss';

export default function EventList({
  events,
  selectedGroup,
  fetchGroupEvents,
}: {
  events: Event[];
  selectedGroup: Group | null;
  fetchGroupEvents: (groupId: string) => void;
}) {
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

  const getStageColor = (stage: EventStage) => {
    const colors = {
      idea: 'var(--color-stage-idea)',
      picked: 'var(--color-stage-picked)',
      planned: 'var(--color-stage-planned)',
    };
    return colors[stage];
  };

  const handleAddEvent = async () => {
    if (!newEventTitle.trim() || !selectedGroup) return;

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEventTitle,
          description: newEventDescription,
          stage: 'idea',
          ownerId: selectedGroup.id,
          ownerType: 'group',
          groupId: selectedGroup.id,
        }),
      });

      if (response.ok) {
        setNewEventTitle('');
        setNewEventDescription('');
        setAddEventOpen(false);
        fetchGroupEvents(selectedGroup.id);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    /* Events List */
    <Box className="groups-page__events">
      {/* Events Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">Events</Typography>
        <IconButton
          color="primary"
          onClick={() => setAddEventOpen(true)}
          size="small"
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Box className="groups-page__events-header"></Box>
      <Stack
        className="groups-page__events-list"
        direction="row"
        spacing={2}
        sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
          pb: 2,
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'var(--color-light-background-1)',
            borderRadius: 'var(--border-radius-md)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--color-primary-main)',
            borderRadius: 'var(--border-radius-md)',
          },
        }}
      >
        {events.length === 0 ? (
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              py: 4,
              color: 'var(--color-text-secondary)',
              width: '100%',
            }}
          >
            No events yet. Add one to get started!
          </Typography>
        ) : (
          events.map((event) => (
            <Box
              key={event.id}
              className="groups-page__event-card"
              sx={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                height: '200px',
              }}
            >
              {/* Event Image */}
              <Box
                className="groups-page__event-image"
                sx={{
                  width: '38.2%',
                  minWidth: '38.2%',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <Box
                  className="groups-page__event-image-radius"
                  sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  <img
                    src={
                      event.imageUrl ||
                      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop'
                    }
                    alt={event.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>

                <Chip
                  label={event.stage}
                  size="small"
                  className={`groups-page__event-stage-badge`}
                  sx={{
                    backgroundColor: getStageColor(event.stage),
                  }}
                />
              </Box>

              {/* Event Content */}
              <Stack
                className="groups-page__event-content"
                spacing={1}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '16px',
                  flex: 1,
                  height: '100%',
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    className="groups-page__event-subtitle"
                    sx={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-xs)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Face2
                      sx={{
                        fontSize: 14,
                        color: 'var(--color-text-secondary)',
                      }}
                    />
                    {event.hostName && `${event.hostName}`}
                  </Typography>
                  <Typography variant="h6" className="groups-page__event-title">
                    {event.title}
                  </Typography>
                </Box>

                { (
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {event.time ?? 'Time not specified'}
                  </Typography>
                )}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {event.plannedDate
                        ? shortFormat(new Date(event.plannedDate))
                        : 'Date not specified'}
                    </Typography>
                  </Stack>

                  {/* <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <LocationIcon
                      sx={{
                        fontSize: 14,
                        color: 'var(--color-text-secondary)',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {event.location
                        ? event.location
                        : 'Location not specified'}
                    </Typography>
                  </Stack> */}
         

                <Box
                  className="groups-page__event-rating"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <RatingStars rating={5} fontSize={36}></RatingStars>
                </Box>
                {/* Comments indicator */}
                {event.comments && event.comments.length > 0 && (
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{
                      alignItems: 'center',
                    }}
                  >
                    {/* {event.comments.slice(0, 3).map((comment, idx) => (
                        <Box
                          key={idx}
                          className="groups-page__event-avatar"
                          sx={{
                            zIndex: 3 - idx,
                            backgroundColor: '#a8fec2',
                            width: '24px',
                            height: '24px',
                          }}
                        ></Box>
                      ))} */}

                    {/* <Typography
                        variant="caption"
                        sx={{ color: 'var(--color-text-secondary)', ml: 0.5, fontSize: '0.7rem' }}
                      >
                        {event.comments.length}{' '}
                        {event.comments.length === 1 ? 'comment' : 'comments'}
                      </Typography> */}
                  </Stack>
                )}
              </Stack>
            </Box>
          ))
        )}
      </Stack>
      {/* Add Event Dialog */}
      <Dialog
        open={addEventOpen}
        onClose={() => setAddEventOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              fullWidth
              className="groups-page__dialog-input"
            />
            <TextField
              label="Description (Optional)"
              value={newEventDescription}
              onChange={(e) => setNewEventDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              className="groups-page__dialog-input"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddEventOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAddEvent} variant="contained" color="primary">
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
