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
} from '@mui/icons-material';
import { Event, EventStage, Group } from '../../../../lib/types';
import './groups-page.scss';

interface GroupsPageProps {
  userId: string;
}

export function GroupsPage({ userId }: GroupsPageProps) {
  const [groups, setGroups] = useState<Group[]>([{
    id: '1',
    name: 'Muchers',
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
  const [events, setEvents] = useState<Event[]>([
    {
      id: 'event1',
      title: 'Taco Guild',
      description: 'Taco Guild Hosted by Carina.',
      createdBy: 'Carina',
      stage: 'idea',
      ownerId: '1',
      ownerType: 'group',
      groupId: '1',
      comments: [{
        id: 'comment1',
        eventId: 'event1',
        userId: 'user1',
        content: 'This is a comment on the event.',
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      ratings: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
        {
      id: 'event2',
      title: 'Thai Food',
      description: 'Thai Food Hosted by Rene.',
      createdBy: 'Rene',
      stage: 'planned',
      ownerId: '1',
      ownerType: 'group',
      groupId: '1',
      comments: [{
        id: 'comment2',
        eventId: 'event2',
        userId: 'user1',
        content: 'This is a comment on the event.',
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      ratings: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]);
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
          Create a group to start planning events with friends Or in an idea to your profile.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="groups-page__container">
      <Stack className="groups-page" spacing={1}>
        {/* Header */}
        <Box className="groups-page__header">
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {}
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
              <Tab 
                key={group.id} 
                label={group.name}
                icon={<PeopleIcon />}
                iconPosition="start"
              />
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
            <Tab 
              label="All" 
              value="all" 
              icon={<ViewListIcon />}

              iconPosition="start"
            />
            <Tab 
              label="Ideas" 
              value="idea" 
              className="groups-page__filter-tab-idea"
              icon={<LightbulbIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Picked" 
              value="picked" 
              icon={<CheckCircleIcon />}
              iconPosition="start"
              className="groups-page__filter-tab-picked"
            />
            <Tab 
              label="Planned" 
              value="planned" 
              icon={<EventIcon />}
              iconPosition="start"
              className="groups-page__filter-tab-planned"
            />
          </Tabs>
        </Box>

        {/* Events Section */}
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">
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

        {/* Events List */}
        <Box className="groups-page__events">
          <Box className="groups-page__events-header">

 
          </Box>

          <Stack className="groups-page__events-list" spacing={1}>
            {events.length === 0 ? (
              <Typography 
                variant="body2" 
                sx={{ textAlign: 'center', py: 4, color: 'var(--color-text-secondary)' }}
              >
                No events yet. Add one to get started!
              </Typography>
            ) : (
              events.map((event) => (
                
                <Box key={event.id} className="groups-page__event-item">
                  <Stack direction="row" className={`groups-page__event-header ${event.stage}`} >
                  <Chip
                        label={event.stage}
                        size="small"
                        className={`groups-page__event-stage-badge`}
                        sx={{
                          backgroundColor: getStageColor(event.stage),
                        }}
                      />
                  </Stack>
                   
                  <Card className="groups-page__event-card">
      
                    {/* Event Image */}
                    <Box className="groups-page__event-image">
                      <img 
                        src={event.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop'} 
                        alt={event.title}
                      />

                    </Box>

                    {/* Event Content */}
                    <Box className="groups-page__event-content">
                      <Typography variant="h6" className="groups-page__event-title">
                        {event.title}
                      </Typography>
                      
                      {event.description && (
                        <Typography 
                          variant="body2" 
                          className="groups-page__event-description"
                        >
                          {event.description}
                        </Typography>
                      )}

                      {/* Event Details */}
                      <Stack spacing={0.5} className="groups-page__event-details">
                        {event.hostId && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PersonIcon sx={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
                            <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                              {event.hostId}
                            </Typography>
                          </Stack>
                        )}

                        {event.plannedDate && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarIcon sx={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
                            <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                              {new Date(event.plannedDate).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        )}

                        {event.location && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LocationIcon sx={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
                            <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                              {event.location}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>

                      {/* Comments indicator */}
                      {event.comments && event.comments.length > 0 && (
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                          <Stack direction="row" spacing={-1}>
                            {event.comments.slice(0, 3).map((comment, idx) => (
                              <Box 
                                key={idx}
                                className="groups-page__event-avatar"
                                sx={{ 
                                  zIndex: 3 - idx,
                                  backgroundColor: '#6366f1',
                                }}
                              >
                                <PersonIcon sx={{ fontSize: 14, color: '#fff' }} />
                              </Box>
                            ))}
                          </Stack>
                          <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)', ml: 1 }}>
                            {event.comments.length} {event.comments.length === 1 ? 'comment' : 'comments'}
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                  </Card>
                </Box>
              ))
            )}
          </Stack>
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
      </Stack>
    </div>
  );
}
