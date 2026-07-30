'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  Stack,
  Drawer,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  ArrowBack,
  Close as CloseIcon,
  Tune,
} from '@mui/icons-material';
import { Event, EventStage, Group } from '../../../../lib/types';

import './groups-page.scss';

import EventList from '../event-list.tsx/event-list';
import { Avatar } from 'src/components/avatar/avatar';
import { setgroups } from 'process';

const fetchAllGroups = async (userId: string): Promise<Group[]> => {
  try {
    const response = await fetch(`/api/groups?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Groups API returned ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};

export function GroupsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const initialDate = new Date('2024-01-01T12:00:00.000Z');
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const phoneNumber = window.localStorage.getItem('phoneNumber');
    if (!phoneNumber) {
      router.push('/');
    }
    setUserId(phoneNumber);
  }, [router]);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [events, setEvents] = useState<Event[]>([
    {
      id: 'event1',
      title: 'Taco Guild',
      description:
        'Set in an old church, this gastropublike spot serves sustainable Mexican fare, craft beer & tequila.',
      createdBy: 'Carina',
      hostName: 'Carina',
      hostAvatarUrl: 'avatars/avatar_1.png',
      stage: 'idea',
      ownerId: '1',
      ownerType: 'group',
      groupId: '1',
      time: '5pm',
      comments: [
        {
          id: 'comment1',
          eventId: 'event1',
          userId: 'user1',
          content: 'This is a comment on the event.',
          createdAt: initialDate,
          updatedAt: initialDate,
        },
      ],
      ratings: [],
      createdAt: initialDate,
      updatedAt: initialDate,
      plannedDate: new Date('2024-07-15 '),
      location: '546 E Osborn Rd, Phoenix, AZ 85012',
    },
    {
      id: 'event2',
      title: 'Thai Food',
      description: 'Thai Food Hosted by Rene.',
      hostName: 'Rene',
      createdBy: 'Rene',
      hostAvatarUrl: 'avatars/avatar_3.png',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmdwi2GWUL2-LrrslXqbf8ZsLyZo_cCL_SscWvrdEaBQqZIxOXFfAcOzO-&s=10',
      stage: 'picked',
      ownerId: '1',
      ownerType: 'group',
      groupId: '1',
      time: '2pm',
      comments: [
        {
          id: 'comment2',
          eventId: 'event2',
          userId: 'user1',
          content: 'This is a comment on the event.',
          createdAt: initialDate,
          updatedAt: initialDate,
        },
      ],
      ratings: [],
      createdAt: initialDate,
      updatedAt: initialDate,
    },
    {
      id: 'event3',
      title: 'Brunch',
      description: 'Brunch Hosted by Jinx.',
      createdBy: 'Jinx',
      hostAvatarUrl: '/avatars/avatar_4.png',
      hostName: 'Jinx',
      stage: 'idea',
      imageUrl:
        'https://invitingeats.com/wp-content/uploads/2021/08/brunch-bowl-banner.jpg',
      ownerId: '1',
      ownerType: 'group',
      groupId: '1',
      comments: [
        {
          id: 'comment2',
          eventId: 'event2',
          userId: 'user1',
          content: 'This is a comment on the event.',
          createdAt: initialDate,
          updatedAt: initialDate,
        },
      ],
      ratings: [],
      createdAt: initialDate,
      updatedAt: initialDate,
    },
    {
      id: 'event4',
      title: 'Burgers',
      description: 'Burgers Hosted by Jinx.',
      createdBy: 'Francis',
      hostAvatarUrl: '/avatars/avatar_2.png',
      hostName: 'Francis',
      imageUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScQ5rLAGJf1bH_n8DZgDYENtrklTouw-Q1i-KXayp4gw&s=10',
      stage: 'idea',
      ownerId: '1',
      ownerType: 'group',
      groupId: '1',
      comments: [
        {
          id: 'comment3',
          eventId: 'event4',
          userId: 'user1',
          content: 'This is a comment on the event.',
          createdAt: initialDate,
          updatedAt: initialDate,
        },
      ],
      ratings: [],
      createdAt: initialDate,
      updatedAt: initialDate,
    },
  ]);
  const [stageFilter, setStageFilter] = useState<EventStage | 'all'>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchGroups();
  }, [userId]);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`/api/groups?userId=${userId}`);
      const contentType = response.headers.get('content-type') || '';

      if (!response.ok) {
        throw new Error(`Groups API returned ${response.status}`);
      }

      if (!contentType.includes('application/json')) {
        throw new Error('Groups API did not return JSON');
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setGroups(data);
        setSelectedGroup(data[0]);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setGroups([
        {
          id: '1',
          name: 'Munchers',
          description: 'A group for food lovers.',
        },
      ]);
      setLoading(false);
    }
  };

  const fetchGroupEvents = async (groupId: string) => {
    try {
      const url =
        stageFilter === 'all'
          ? `/api/events?groupId=${groupId}`
          : `/api/events?groupId=${groupId}&stage=${stageFilter}`;

      const response = await fetch(url);
      const contentType = response.headers.get('content-type') || '';

      if (!response.ok || !contentType.includes('application/json')) {
        throw new Error('Events API did not return JSON');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  if (loading) {
    return (
      <Box className="groups-page__container ">
        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
          }}
          spacing={2}
        >
          <CircularProgress size={80} />
          <img
            src="/images/loading-splash.png"
            width={600}
            height={400}
            alt="Logo"
            className="groups-page__loading-logo"
          />
        </Stack>
      </Box>
    );
  }

  if (groups.length === 0) {
    return (
      <Box className="groups-page__container">
        <Typography variant="h5">No groups yet</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Create a group to start planning events with friends Or in an idea to
          your profile.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="groups-page__container">
      <Stack className="groups-page" spacing={1}>
        {/* Header */}
        <Box
          className="groups-page__header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <IconButton
            onClick={() => window.history.back()}
            className="groups-page__back-button"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h3">Groups</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button>
              <Tune onClick={() => setDrawerOpen(true)} />
            </Button>

            <Avatar
              src="/avatars/avatar_0.png"
              alt="User Avatar"
              size="large"
            />
          </Stack>
        </Box>

        {/* Groups List */}
        <Box className="groups-page__groups-list">
          <Tabs
            value={groups.findIndex((g) => g.id === selectedGroup?.id || 1)}
            // onChange={(_, index) => setSelectedGroup(groups[index])}
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

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          variant="temporary"
          slotProps={{
            paper: {
              sx: { minWidth: '300px', padding: '16px', borderRadius: '0' },
            },
          }}
        >
          {/* Filter Tabs */}
          <Box className="groups-page__filters">
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 2,
              }}
            >
              <Typography variant="h5">Filter by Stage</Typography>
              <IconButton onClick={() => setDrawerOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>

            <Tabs
              value={stageFilter}
              onChange={(_, value) => setStageFilter(value)}
              scrollButtons="auto"
            >
              <Tab
                label="All"
                value="all"
                className="groups-page__filter-tab-item groups-page__filter-tab-all"
                icon={<LightbulbIcon />}
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
        </Drawer>
        <EventList events={events} fetchGroupEvents={fetchGroupEvents} />
      </Stack>
    </div>
  );
}
