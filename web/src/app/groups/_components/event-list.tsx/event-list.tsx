import React, { useState } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';

import { Event, EventTypeLabels, Group } from '../../../../lib/types';
import { EventItem } from '../event-item/event-item';
import { EventItemSkeleton } from '../event-item/event-item.skeleton';
import { ChevronRight } from '@mui/icons-material';

import './event-list.scss';
import '../groups-page/groups-page.scss';

export default function EventList({
  events,
  selectedGroup,
  eventsLoading,
  itemSize = 'large',
  showTypeSections = true,
  groupByStageRows = false,
  fetchGroupEvents,
}: {
  events: Event[];
  selectedGroup?: Group | null;
  eventsLoading?: boolean;
  itemSize?: 'small' | 'medium' | 'large';
  showTypeSections?: boolean;
  groupByStageRows?: boolean;
  fetchGroupEvents: (groupId: string) => void;
}) {
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

  const stageRows: Array<{
    key: 'planned' | 'picked' | 'idea' | 'completed';
    label: string;
    color: string;
  }> = [
    {
      key: 'completed',
      label: 'Completed',
      color: 'var(--color-stage-completed)',
    },
    { key: 'planned', label: 'Planned', color: 'var(--color-stage-planned)' },
    { key: 'picked', label: 'Picked', color: 'var(--color-stage-picked)' },
    { key: 'idea', label: 'Idea', color: 'var(--color-stage-idea)' },
  ];

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
        <Typography className="groups-page__plan-title" variant="h4">
          Plans
        </Typography>
        {/* <IconButton
          color="primary"
          onClick={() => setAddEventOpen(true)}
          size="small"
        >
          <AddIcon />
        </IconButton> */}
      </Box>

      {groupByStageRows ? (
        <Stack spacing={2}>
          {stageRows.map((stageRow) => {
            const stageEvents = events.filter(
              (event) => event.stage === stageRow.key,
            );

            return (
              <Box key={stageRow.key}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '999px',
                      backgroundColor: stageRow.color,
                      color: 'var(--color-primary-dark)',
                    }}
                  >
                    {stageRow.label}
                  </Typography>
                </Box>

                <Box
                  className="groups-page__events-list"
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    pb: 2,
                    WebkitOverflowScrolling: 'touch',
                    '&::-webkit-scrollbar': {
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'var(--color-light-background-4)',
                      borderRadius: 'var(--border-radius-md)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: stageRow.color,
                      borderRadius: 'var(--border-radius-md)',
                    },
                  }}
                >
                  {eventsLoading ? (
                    <>
                      <EventItemSkeleton size={itemSize} />
                      <EventItemSkeleton size={itemSize} />
                    </>
                  ) : stageEvents.length === 0 ? (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'var(--color-text-secondary)',
                        px: 1,
                        py: 2,
                      }}
                    >
                      No {stageRow.label.toLowerCase()} events.
                    </Typography>
                  ) : (
                    stageEvents.map((event) => (
                      <EventItem key={event.id} event={event} size={itemSize} />
                    ))
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>
      ) : (
        <Box
          className="groups-page__events-list"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            overflowX: 'auto',
            overflowY: 'hidden',
            pb: 2,
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'var(--color-light-background-4)',
              borderRadius: 'var(--border-radius-md)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'var(--color-primary-main)',
              borderRadius: 'var(--border-radius-md)',
            },
          }}
        >
          {eventsLoading ? (
            <>
              <EventItemSkeleton size={itemSize} />
              <EventItemSkeleton size={itemSize} />
              <EventItemSkeleton size={itemSize} />
            </>
          ) : events.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <img
                src="/images/empty.png"
                alt="No events"
                width={500}
                height={350}
              />
              <Typography variant="subtitle1">No events found.</Typography>
            </Box>
          ) : (
            events.map((event) => (
              <EventItem key={event.id} event={event} size={itemSize} />
            ))
          )}
        </Box>
      )}

      {showTypeSections &&
        Object.entries(EventTypeLabels).map(([type, label]) => (
          <Box key={type} sx={{ width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <IconButton
                color="primary"
                onClick={() => setAddEventOpen(true)}
                size="small"
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6">{label}</Typography>
                  <ChevronRight />
                </Box>
              </IconButton>
            </Box>
          </Box>
        ))}

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
