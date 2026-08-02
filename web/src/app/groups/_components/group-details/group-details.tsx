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
  Typography,
} from '@mui/material';
import { ArrowBack, Group as GroupIcon, Place, Add } from '@mui/icons-material';
import type { Event, Group } from '../../../../lib/types';
import EventList from '../event-list.tsx/event-list';
import { CreateEventIdeaDrawer } from 'src/components/create-event-idea-drawer/create-event-idea-drawer';

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
      <Box className="group-detail-page__loading">
        <CircularProgress size={64} />
      </Box>
    );
  }

  if (groupQuery.isError || !groupQuery.data?.group) {
    return (
      <Box className="group-detail-page__loading">
        <Typography variant="h6">Unable to load group.</Typography>
      </Box>
    );
  }

  const group = groupQuery.data.group;
  const members = groupQuery.data.members ?? [];

  return (
    <Box className="group-detail-page">
      <Box className="group-detail-page__hero">
        <img
          className="group-detail-page__hero-image"
          src={group.image || '/images/event-types/foodie.png'}
          alt={group.name}
        />
        <Box className="group-detail-page__hero-gradient" />

        <Stack className="group-detail-page__hero-overlay" spacing={1}>
          <IconButton
            className="group-detail-page__back"
            onClick={() => window.history.back()}
          >
            <ArrowBack />
          </IconButton>

          <Typography variant="h4" className="group-detail-page__title">
            {group.name}
          </Typography>

          <Typography
            variant="body2"
            className="group-detail-page__description"
          >
            {group.description || 'No group description yet.'}
          </Typography>
        </Stack>
      </Box>

      <Stack className="group-detail-page__content" spacing={3}>
        <Stack
          direction="row"
          spacing={3}
          className="group-detail-page__meta-row"
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <GroupIcon fontSize="small" />
            <Typography variant="body2">{members.length} members</Typography>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Place fontSize="small" />
            <Typography variant="body2">
              {eventsQuery.data?.length ?? 0} events
            </Typography>
          </Stack>
        </Stack>

        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Members
          </Typography>
          <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
            <AvatarGroup max={20} total={members.length}>
              {members.slice(0, 5).map((member) => (
                <Avatar
                  key={member.userId}
                  src={member.avatarUrl}
                  alt={member.displayName}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setMembersDrawerOpen(true)}
                />
              ))}
            </AvatarGroup>
          </Stack>
          <Button
            variant="text"
            onClick={() => setMembersDrawerOpen(true)}
            sx={{ mt: 1, p: 0 }}
          >
            View all members
          </Button>
        </Box>

        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography variant="h5">Group Ideas & Recommendations</Typography>
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={() => setCreateIdeaOpen(true)}
          >
            New Idea
          </Button>
        </Stack>

        <EventList
          events={eventsQuery.data ?? []}
          selectedGroup={group}
          eventsLoading={eventsQuery.isLoading || eventsQuery.isFetching}
          itemSize="medium"
          showTypeSections={false}
          groupByStageRows
          fetchGroupEvents={async () => {
            await eventsQuery.refetch();
          }}
        />
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
