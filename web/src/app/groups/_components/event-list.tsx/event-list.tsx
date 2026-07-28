import React, { useState } from 'react';
import { shortFormat } from '../../../../lib/utils';
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
import { ChevronRight } from '@mui/icons-material';

import './event-list.scss';
import '../groups-page/groups-page.scss';

export default function EventList({
  events,
  selectedGroup,
  fetchGroupEvents,
}: {
  events: Event[];
  selectedGroup?: Group | null;
  fetchGroupEvents: (groupId: string) => void;
}) {
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

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
        {/* <IconButton
          color="primary"
          onClick={() => setAddEventOpen(true)}
          size="small"
        >
          <AddIcon />
        </IconButton> */}
      </Box>

      <Stack
        className="groups-page__events-list"
        direction="row"
        spacing={1}
        sx={{
          overflowX: 'auto',
          overflowY: 'hidden',
          pb: 2,
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
        {events.length === 0 ? (
          <Stack
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <img src="/images/empty.png" alt="No events" />
          </Stack>
        ) : (
          events.map((event) => <EventItem key={event.id} event={event} />)
        )}
      </Stack>

      {Object.entries(EventTypeLabels).map(([type, label]) => (
        <>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <IconButton
              color="primary"
              onClick={() => setAddEventOpen(true)}
              size="small"
            >
              <Stack direction="row" sx={{ alignItems: 'center' }}>
                <Typography variant="h6">{label}</Typography> <ChevronRight />
              </Stack>
            </IconButton>
          </Stack>

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
                backgroundColor: 'var(--color-light-background-4)',
                borderRadius: 'var(--border-radius-md)',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'var(--color-primary-main)',
                borderRadius: 'var(--border-radius-md)',
              },
            }}
          >
            {events.length === 0 ? (
              <Stack
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              ></Stack>
            ) : (
              <></>
              //   events.map((event) => <EventItem key={event.id} event={event} />)
            )}
          </Stack>
        </>
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
