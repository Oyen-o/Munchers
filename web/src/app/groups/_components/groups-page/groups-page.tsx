'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@mui/icons-material';
import { Event, EventStage, Group } from '../../../../lib/types';
import './groups-page.scss';
import RatingStars from '../ratings/rating';
import EventList from '../event-list.tsx/event-list';

interface GroupsPageProps {
  userId: string;
}

export function GroupsPage({ userId }: GroupsPageProps) {
  const router = useRouter();
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
      description: 'Set in an old church, this gastropublike spot serves sustainable Mexican fare, craft beer & tequila.',
      createdBy: 'Carina',
      hostName: 'Carina',
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
      plannedDate: new Date('2024-07-15'),
      location: '546 E Osborn Rd, Phoenix, AZ 85012',
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
    },
            {
      id: 'event3',
      title: 'Brunch',
      description: 'Brunch Hosted by Alex.',
      createdBy: 'Alex',
      hostName: 'Alex ',
      stage: 'picked',
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

  if (loading) {
    return (
      <Box className="groups-page__container ">
        <Stack sx={{alignItems:'center', justifyContent:'center'}} spacing={2}>
          <CircularProgress size={80} />
          <Box></Box>
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
        <Box className="groups-page__header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton onClick={() => window.history.back()} className="groups-page__back-button">
            <ArrowBack />
          </IconButton>
          <Typography variant="h3" >
            Groups
          </Typography>
          <Box sx={{ width: 40 }} /> {/* Spacer for centering */}
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
          <Typography variant="body1" sx={{ mb: 1,mt:2   }}>
            Filter by Stage
          </Typography>
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
              className="groups-page__filter-tab-item groups-page__filter-tab-idea"
              icon={<LightbulbIcon />}
              iconPosition="start"
            />
            <Tab 
              label="Picked" 
              value="picked" 
              icon={<CheckCircleIcon />}
              iconPosition="start"
              className="groups-page__filter-tab-item groups-page__filter-tab-picked"
            />
            <Tab 
              label="Planned" 
              value="planned" 
              icon={<EventIcon />}
              iconPosition="start"
              className="groups-page__filter-tab-item groups-page__filter-tab-planned"
            />
          </Tabs>
        </Box>
          <EventList events={events} selectedGroup={selectedGroup} fetchGroupEvents={fetchGroupEvents} />
      </Stack>
    </div>
  );
}
