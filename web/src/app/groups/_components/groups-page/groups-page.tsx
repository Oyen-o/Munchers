'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  TextField,
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
import type { EventDocument } from '../../../../lib/cosmos/cosmos.types';

import './groups-page.scss';

import EventList from '../event-list.tsx/event-list';
import { Avatar } from 'src/components/avatar/avatar';

export function GroupsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const phoneNumber = window.localStorage.getItem('phoneNumber');
    if (!phoneNumber) {
      router.push('/');
    }
    setUserId(phoneNumber);
  }, [router]);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [stageFilter, setStageFilter] = useState<EventStage | 'all'>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [eventSearch, setEventSearch] = useState('');

  const groupsFallback: Group[] = [
    {
      id: 'group1',
      name: 'Munchers',
      description: 'A group for food lovers.',
    },
  ];

  const groupsQuery = useQuery<Group[], Error>({
    queryKey: ['groups', userId],
    enabled: Boolean(userId),
    retry: false,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      const response = await fetch(`/api/groups?userId=${userId}`);
      const contentType = response.headers.get('content-type') || '';

      if (!response.ok) {
        throw new Error(`Groups API returned ${response.status}`);
      }

      if (!contentType.includes('application/json')) {
        throw new Error('Groups API did not return JSON');
      }

      const data: unknown = await response.json();
      return Array.isArray(data) ? (data as Group[]) : [];
    },
  });

  const groups =
    groupsQuery.data && groupsQuery.data.length > 0
      ? groupsQuery.data
      : groupsQuery.isError
        ? groupsFallback
        : [];

  useEffect(() => {
    if (groupsQuery.isError) {
      console.error('Error fetching groups:', groupsQuery.error);
    }
  }, [groupsQuery.error, groupsQuery.isError]);

  useEffect(() => {
    if (groups.length === 0) {
      setSelectedGroup(null);
      return;
    }

    if (
      !selectedGroup ||
      !groups.some((group) => group.id === selectedGroup.id)
    ) {
      setSelectedGroup(groups[0]);
    }
  }, [groups, selectedGroup]);

  const eventsQuery = useQuery<Event[], Error>({
    queryKey: ['events', selectedGroup?.id, stageFilter],
    enabled: Boolean(selectedGroup?.id),
    retry: false,
    queryFn: async () => {
      const groupId = selectedGroup?.id;

      if (!groupId) {
        return [];
      }

      const url = `/api/events?groupId=${groupId}`;

      const response = await fetch(url);
      const contentType = response.headers.get('content-type') || '';

      if (!response.ok || !contentType.includes('application/json')) {
        throw new Error('Events API did not return JSON');
      }

      const data: unknown = await response.json();
      return Array.isArray(data) ? (data as Event[]) : [];
    },
  });

  useEffect(() => {
    if (eventsQuery.isError) {
      console.error('Error fetching events:', eventsQuery.error);
    }
  }, [eventsQuery.error, eventsQuery.isError]);

  const fetchGroupEvents = async (groupId: string | undefined) => {
    if (groupId && groupId !== selectedGroup?.id) {
      const groupToSelect = groups.find((group) => group.id === groupId);
      if (groupToSelect) {
        setSelectedGroup(groupToSelect);
      }
      return;
    }

    await eventsQuery.refetch();
  };

  const loading = !userId || groupsQuery.isLoading;
  const events = eventsQuery.data ?? [];
  const normalizedSearch = eventSearch.trim().toLowerCase();
  const filteredEvents = events.filter((event) => {
    if (stageFilter !== 'all' && event.stage !== stageFilter) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const eventOwner = event.hostName ?? event.createdBy ?? '';

    return [event.title, eventOwner, event.description ?? ''].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    );
  });
  const eventsLoading = eventsQuery.isLoading || eventsQuery.isFetching;

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
            width={500}
            height={350}
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
            variant="scrollable"
            scrollButtons="auto"
          >
            {groups.map((group) => (
              <Tab
                key={group.id}
                label={group.name}
                icon={<PeopleIcon />}
                iconPosition="start"
                onClick={() => {
                  router.push(`/groups/${group.id}`);
                }}
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
              sx: {
                maxWidth: '95%',
                padding: '16px',
                borderRadius: '0',
              },
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

            <TextField
              fullWidth
              size="small"
              label="Search events"
              placeholder="Filter by name, owner, or description"
              value={eventSearch}
              onChange={(event) => setEventSearch(event.target.value)}
              sx={{ mb: 2 }}
            />

            <Tabs
              value={stageFilter}
              onChange={(_, value) => setStageFilter(value)}
              variant="scrollable"
              className="groups-page__filter-tabs"
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
              <Tab
                label="Completed"
                value="completed"
                icon={<CheckCircleIcon />}
                iconPosition="start"
                className="groups-page__filter-tab-item groups-page__filter-tab-planned"
              />
            </Tabs>
          </Box>
        </Drawer>
        <EventList
          events={filteredEvents}
          selectedGroup={selectedGroup}
          eventsLoading={eventsLoading}
          itemSize="large"
          showTypeSections={true}
          fetchGroupEvents={fetchGroupEvents}
        />
      </Stack>
    </div>
  );
}
