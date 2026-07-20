'use client';

import { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  Button,
  TextField,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { Event, EventStage, Group } from '../../lib/types';
import './groups-page.scss';

interface GroupsPageProps {
  userId: string;
}

export function GroupsPage({ userId }: GroupsPageProps) {
  const [groups, setGroups] = useState<Group[]>([{
    id: '1',
    name: 'Sample Group',
    description: 'This is a sample group for demonstration purposes.',
    createdBy: userId,
    members: [{
      userId,
      role: 'admin',
      joinedAt: new Date(),
    }],
    createdAt: new Date(),
    updatedAt: new Date(),
  }], 
  );
  console.log('GroupsPage userId:', userId);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [stageFilter, setStageFilter] = useState<EventStage | 'all'>('all');
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, [userId]);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupEvents(selectedGroup.id);
    }
  }, [selectedGroup, stageFilter]);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`/api/groups?userId=${userId}`);
      const data = await response.json();
      if (data.length > 0) {
        setSelectedGroup(data[0]);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupEvents = async (groupId: string) => {
    try {
      const url = stageFilter === 'all' 
        ? `/api/events?groupId=${groupId}`
        : `/api/events?groupId=${groupId}&stage=${stageFilter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
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

  const getStageColor = (stage: EventStage) => {
    const colors = {
      idea: 'var(--color-stage-idea)',
      picked: 'var(--color-stage-picked)',
      planned: 'var(--color-stage-planned)',
    };
    return colors[stage];
  };

  if (loading) {
    return (
      <Box className="groups-page__container ">
        <Stack justifycontent="center" alignitems="center" minheight="100vh">
          <CircularProgress size={80} />
        </Stack> 
      </Box>
    );
  }

  

  if (groups.length === 0) {
    return (
      <Box className="groups-page__container">
        <Typography variant="h5">No groups yet</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Create a group to start planning events with friends
        </Typography>
      </Box>
    );
  }

  return (
    <div className="groups-page__container">
      <Box className="groups-page">
        {/* Header */}
        <Box className="groups-page__header">
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            My Groups
          </Typography>
        </Box>

        {/* Groups List */}
        <Box className="groups-page__groups-list">
          <Tabs
            value={groups.findIndex((g) => g.id === selectedGroup?.id)}
            onChange={(_, index) => setSelectedGroup(groups[index])}
            variant="scrollable"
            scrollButtons="auto"
          >
            {groups.map((group) => (
              <Tab key={group.id} label={group.name} />
            ))}
          </Tabs>
        </Box>

        {/* Filter Tabs */}
        <Box className="groups-page__filters">
          <Tabs
            value={stageFilter}
            onChange={(_, value) => setStageFilter(value)}
            variant="fullWidth"
          >
            <Tab label="All" value="all" />
            <Tab label="Ideas" value="idea" />
            <Tab label="Picked" value="picked" />
            <Tab label="Planned" value="planned" />
          </Tabs>
        </Box>

        {/* Events List */}
        <Box className="groups-page__events">
          <Box className="groups-page__events-header">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Events
            </Typography>
            <IconButton 
              color="primary" 
              onClick={() => setAddEventOpen(true)}
              size="small"
            >
              <AddIcon />
            </IconButton>
          </Box>

          <List className="groups-page__events-list">
            {events.length === 0 ? (
              <Typography 
                variant="body2" 
                sx={{ textAlign: 'center', py: 4, color: 'var(--color-text-secondary)' }}
              >
                No events yet. Add one to get started!
              </Typography>
            ) : (
              events.map((event) => (
                <ListItem key={event.id} className="groups-page__event-item">
                  <Card className="groups-page__event-card">
                    <Box className="groups-page__event-content">
                      <Box className="groups-page__event-header">
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          {event.title}
                        </Typography>
                        <Chip
                          label={event.stage}
                          size="small"
                          sx={{
                            backgroundColor: getStageColor(event.stage),
                            color: '#fff',
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                      
                      {event.description && (
                        <Typography 
                          variant="body2" 
                          sx={{ mt: 1, color: 'var(--color-text-secondary)' }}
                        >
                          {event.description}
                        </Typography>
                      )}

                      {event.hostId && (
                        <Typography 
                          variant="caption" 
                          sx={{ mt: 1, color: 'var(--color-text-secondary)' }}
                        >
                          Host: {event.hostId}
                        </Typography>
                      )}

                      {event.plannedDate && (
                        <Typography 
                          variant="caption" 
                          sx={{ mt: 0.5, color: 'var(--color-text-secondary)' }}
                        >
                          Date: {new Date(event.plannedDate).toLocaleDateString()}
                        </Typography>
                      )}

                      {event.location && (
                        <Typography 
                          variant="caption" 
                          sx={{ mt: 0.5, color: 'var(--color-text-secondary)' }}
                        >
                          Location: {event.location}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </ListItem>
              ))
            )}
          </List>
        </Box>

        {/* Add Event Dialog */}
        <Dialog open={addEventOpen} onClose={() => setAddEventOpen(false)} maxWidth="sm" fullWidth>
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
    </div>
  );
}
