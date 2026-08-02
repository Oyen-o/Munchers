import React, { useEffect, useState } from 'react';
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
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { Event, EventTypeLabels, Group } from '../../../../lib/types';
import { EventItem } from '../event-item/event-item';
import { EventItemSkeleton } from '../event-item/event-item.skeleton';
import { ChevronRight } from '@mui/icons-material';

import './event-list.scss';
import '../groups-page/groups-page.scss';

type StageKey = 'planned' | 'picked' | 'idea' | 'completed';

function StageDropZone({
  stage,
  children,
}: {
  stage: StageKey;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `stage-${stage}`,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        borderRadius: '12px',
        transition: 'background-color 0.2s ease, outline-color 0.2s ease',
        backgroundColor: isOver ? 'rgba(95, 191, 129, 0.12)' : 'transparent',
        outline: isOver
          ? '2px dashed rgba(45, 155, 82, 0.5)'
          : '2px dashed transparent',
        outlineOffset: '-2px',
      }}
    >
      {children}
    </Box>
  );
}

function DraggableEventCard({
  event,
  size,
}: {
  event: Event;
  size: 'small' | 'medium' | 'large';
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `event-${event.id}`,
      data: {
        eventId: event.id,
        fromStage: event.stage,
      },
    });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.75 : 1,
      }}
      sx={{
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      {...listeners}
      {...attributes}
    >
      <EventItem event={event} size={size} />
    </Box>
  );
}

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
  fetchGroupEvents: (groupId?: string) => Promise<void>;
}) {
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [eventsData, setEventsData] = useState<Event[]>(events);
  const [activeDragEventId, setActiveDragEventId] = useState<string | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  useEffect(() => {
    setEventsData(events);
  }, [events]);

  const stageRows: Array<{
    key: StageKey;
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

  const handleDragEnd = async (dragEvent: DragEndEvent) => {
    const { active, over } = dragEvent;

    setActiveDragEventId(null);

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (!activeId.startsWith('event-') || !overId.startsWith('stage-')) {
      return;
    }

    const eventId = activeId.replace('event-', '');
    const nextStage = overId.replace('stage-', '') as StageKey;

    const currentEvent = eventsData.find((item) => item.id === eventId);
    if (!currentEvent || currentEvent.stage === nextStage) {
      return;
    }

    const previousStage = currentEvent.stage;

    setEventsData((previousEvents) =>
      previousEvents.map((item) =>
        item.id === eventId ? { ...item, stage: nextStage } : item,
      ),
    );

    try {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: eventId,
          stage: nextStage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Events API returned ${response.status}`);
      }

      if (selectedGroup?.id) {
        await fetchGroupEvents(selectedGroup.id);
      }
    } catch (error) {
      console.error('Error updating event stage:', error);
      setEventsData((previousEvents) =>
        previousEvents.map((item) =>
          item.id === eventId ? { ...item, stage: previousStage } : item,
        ),
      );
    }
  };

  const handleDragStart = (dragEvent: DragStartEvent) => {
    const activeId = String(dragEvent.active.id);
    if (!activeId.startsWith('event-')) {
      setActiveDragEventId(null);
      return;
    }

    setActiveDragEventId(activeId.replace('event-', ''));
  };

  const activeDragEvent = activeDragEventId
    ? (eventsData.find((event) => event.id === activeDragEventId) ?? null)
    : null;

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
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={(dragEvent) => void handleDragEnd(dragEvent)}
          onDragCancel={() => setActiveDragEventId(null)}
        >
          <Stack spacing={2}>
            {stageRows.map((stageRow) => {
              const stageEvents = eventsData.filter(
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

                  <StageDropZone stage={stageRow.key}>
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
                          <DraggableEventCard
                            key={event.id}
                            event={event}
                            size={itemSize}
                          />
                        ))
                      )}
                    </Box>
                  </StageDropZone>
                </Box>
              );
            })}
          </Stack>

          <DragOverlay zIndex={2000}>
            {activeDragEvent ? (
              <Box
                sx={{
                  width:
                    itemSize === 'small'
                      ? 160
                      : itemSize === 'medium'
                        ? 220
                        : 280,
                }}
              >
                <EventItem event={activeDragEvent} size={itemSize} />
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
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
          ) : eventsData.length === 0 ? (
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
            eventsData.map((event) => (
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
