'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  Group as GroupIcon,
  Place,
  Add,
  Search,
  Close as CloseIcon,
} from '@mui/icons-material';
import type { Event, Group } from '../../../../lib/types';
import EventList from '../event-list.tsx/event-list';
import { CreateEventIdeaDrawer } from 'src/components/create-event-idea-drawer/create-event-idea-modal';

import './group-details.scss';

type GroupMemberProfile = {
  userId: string;
  role: 'admin' | 'member';
  displayName: string;
  avatarUrl: string;
};

type GroupDetailsResponse = {
  group: Group;
  members: GroupMemberProfile[];
};

type GroupDetailsProps = {
  groupId: string;
};

export function GroupDetails({ groupId }: GroupDetailsProps) {
  const [membersDrawerOpen, setMembersDrawerOpen] = useState(false);
  const [createIdeaOpen, setCreateIdeaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [eventSearch, setEventSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'places' | 'plans'>('plans');

  // Check if current user is a member
  const currentUserId =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('phoneNumber')
      : null;

  const groupQuery = useQuery<GroupDetailsResponse, Error>({
    queryKey: ['group-details', groupId],
    enabled: Boolean(groupId),
    retry: false,
    queryFn: async () => {
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) {
        throw new Error(`Groups API returned ${response.status}`);
      }

      return (await response.json()) as GroupDetailsResponse;
    },
  });

  const eventsQuery = useQuery<Event[], Error>({
    queryKey: ['group-events', groupId],
    enabled: Boolean(groupId),
    retry: false,
    queryFn: async () => {
      const response = await fetch(`/api/events?groupId=${groupId}`);
      if (!response.ok) {
        throw new Error(`Events API returned ${response.status}`);
      }

      const data: unknown = await response.json();
      return Array.isArray(data) ? (data as Event[]) : [];
    },
  });

  if (groupQuery.isLoading) {
    return (
      <Box className="group-detail__loading">
        <CircularProgress size={64} />
      </Box>
    );
  }

  if (groupQuery.isError || !groupQuery.data?.group) {
    return (
      <Box className="group-detail__loading">
        <Typography variant="h6">Unable to load group.</Typography>
      </Box>
    );
  }

  const group = groupQuery.data.group;
  const members = groupQuery.data.members ?? [];
  const isMember = members.some((member) => member.userId === currentUserId);

  const normalizedSearch = eventSearch.trim().toLowerCase();
  const filteredEvents = (eventsQuery.data ?? []).filter((event) => {
    if (!normalizedSearch) {
      return true;
    }

    const eventOwner = event.hostName ?? event.createdBy ?? '';

    return [event.title, eventOwner, event.description ?? ''].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    );
  });

  return (
    <Box className="group-detail">
      <Box className="group-detail__header">
        <IconButton
          className="group-detail__back"
          onClick={() => window.history.back()}
        >
          <ArrowBack />
        </IconButton>

        <Stack spacing={2} className="group-detail__header-content">
          <Typography className="group-detail__title">{group.name}</Typography>

          <Typography className="group-detail__description">
            {group.description || 'Discovering great places together'}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            className="group-detail__stats"
            sx={{ alignItems: 'center', flexWrap: 'wrap' }}
          >
            <Typography variant="body2" className="group-detail__stat">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </Typography>
            <Typography
              variant="body2"
              className="group-detail__stat-separator"
            >
              •
            </Typography>
            <Typography variant="body2" className="group-detail__stat">
              {eventsQuery.data?.length ?? 0} places
            </Typography>
            <Typography
              variant="body2"
              className="group-detail__stat-separator"
            >
              •
            </Typography>
            <Typography variant="body2" className="group-detail__stat">
              Active
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center' }}
            className="group-detail__members-row"
          >
            <AvatarGroup
              max={6}
              total={members.length}
              sx={{
                cursor: 'pointer',
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  fontSize: '0.875rem',
                  border: '2px solid var(--color-cream-highlights)',
                },
              }}
              onClick={() => setMembersDrawerOpen(true)}
            >
              {members.slice(0, 6).map((member) => (
                <Avatar
                  key={member.userId}
                  src={member.avatarUrl}
                  alt={member.displayName}
                />
              ))}
            </AvatarGroup>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setMembersDrawerOpen(true)}
              sx={{
                textTransform: 'none',
                borderColor: 'var(--color-text-secondary)',
                color: 'var(--color-text-primary)',
                '&:hover': {
                  borderColor: 'var(--color-text-primary)',
                  backgroundColor: 'transparent',
                },
              }}
            >
              + View Members
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Stack className="group-detail__content" spacing={3}>
        {/* Premium Tab Navigation */}
        <Box className="group-detail__tabs">
          <Stack
            direction="row"
            spacing={0}
            className="group-detail__tabs-container"
          >
            <button
              className={`group-detail__tab ${activeTab === 'places' ? 'group-detail__tab--active' : ''}`}
              onClick={() => setActiveTab('places')}
            >
              <span className="group-detail__tab-label">Places</span>
              <span className="group-detail__tab-count">
                {eventsQuery.data?.length ?? 0}
              </span>
            </button>

            {isMember && (
              <button
                className={`group-detail__tab ${activeTab === 'plans' ? 'group-detail__tab--active' : ''}`}
                onClick={() => setActiveTab('plans')}
              >
                <span className="group-detail__tab-label">Plans</span>
                <span className="group-detail__tab-count">
                  {filteredEvents.length}
                </span>
              </button>
            )}
          </Stack>
        </Box>

        {/* Tab Content */}
        {activeTab === 'places' && (
          <>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="h5">Recommendations</Typography>
              {isMember && (
                <Button
                  startIcon={<Add />}
                  variant="contained"
                  onClick={() => setCreateIdeaOpen(true)}
                >
                  Recommend a Place
                </Button>
              )}
            </Stack>

            {/* Places Tab Scaffold - Coming Soon */}
            <Box className="group-detail__places-scaffold">
              <Box
                sx={{
                  py: 8,
                  px: 4,
                  textAlign: 'center',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-cream-highlights)',
                  border: '1px solid var(--bg-border-light)',
                }}
              >
                <Place
                  sx={{
                    fontSize: 48,
                    color: 'var(--color-text-secondary)',
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ mb: 1, color: 'var(--color-text-primary)' }}
                >
                  Places Coming Soon
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'var(--color-text-secondary)',
                    maxWidth: '400px',
                    mx: 'auto',
                  }}
                >
                  {isMember
                    ? "This section will feature the group's favorite places and recommendations."
                    : 'Discover the places this community loves. Join to see all recommendations and contribute your own.'}
                </Typography>
                {!isMember && (
                  <Button
                    variant="contained"
                    sx={{ textTransform: 'none', mt: 3 }}
                  >
                    Join Group
                  </Button>
                )}
              </Box>
            </Box>
          </>
        )}

        {/* Plans Tab - Members Only */}
        {activeTab === 'plans' && (
          <>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="h5">Upcoming Plans</Typography>
              {isMember && (
                <Button
                  startIcon={<Add />}
                  variant="contained"
                  onClick={() => setCreateIdeaOpen(true)}
                >
                  Plan an Event
                </Button>
              )}
            </Stack>

            {!isMember ? (
              <Box className="group-detail__plans-locked">
                <Box
                  sx={{
                    py: 8,
                    px: 4,
                    textAlign: 'center',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-cream-highlights)',
                    border: '1px solid var(--bg-border-light)',
                    mt: 3,
                  }}
                >
                  <GroupIcon
                    sx={{
                      fontSize: 48,
                      color: 'var(--color-text-secondary)',
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ mb: 1, color: 'var(--color-text-primary)' }}
                  >
                    Join to See Plans
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--color-text-secondary)',
                      maxWidth: '400px',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    Members can view and create plans for upcoming events. Join
                    this group to see what's being planned.
                  </Typography>
                  <Button variant="contained" sx={{ textTransform: 'none' }}>
                    Join Group
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    Search
                  </Typography>
                  <IconButton
                    onClick={() => {
                      if (searchOpen) {
                        setEventSearch('');
                      }
                      setSearchOpen((open) => !open);
                    }}
                    size="small"
                  >
                    {searchOpen ? <CloseIcon /> : <Search />}
                  </IconButton>
                </Stack>

                {searchOpen ? (
                  <TextField
                    fullWidth
                    size="small"
                    label="Search plans"
                    placeholder="Filter by name, owner, or description"
                    value={eventSearch}
                    onChange={(event) => setEventSearch(event.target.value)}
                  />
                ) : null}

                <EventList
                  events={filteredEvents}
                  selectedGroup={group}
                  eventsLoading={
                    eventsQuery.isLoading || eventsQuery.isFetching
                  }
                  itemSize="medium"
                  showTypeSections={false}
                  groupByStageRows
                  fetchGroupEvents={async () => {
                    await eventsQuery.refetch();
                  }}
                />
              </>
            )}
          </>
        )}
      </Stack>

      <Drawer
        anchor="left"
        open={membersDrawerOpen}
        onClose={() => setMembersDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 0,
            maxWidth: '90vw',
            width: 360,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Members
          </Typography>
          <List>
            {members.map((member) => (
              <ListItem key={member.userId} disableGutters>
                <ListItemAvatar>
                  <Avatar src={member.avatarUrl} alt={member.displayName} />
                </ListItemAvatar>
                <ListItemText
                  primary={member.displayName}
                  secondary={member.role === 'admin' ? 'Admin' : 'Member'}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <CreateEventIdeaDrawer
        open={createIdeaOpen}
        onClose={() => setCreateIdeaOpen(false)}
        groupId={groupId}
        hostName={group.name}
        onCreated={async () => {
          await eventsQuery.refetch();
        }}
      />
    </Box>
  );
}
