'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  Stack,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

import './create-plan-modal.scss';

type CreatePlanModalProps = {
  open: boolean;
  onClose: () => void;
  placeId: string;
  placeName: string;
  onCreated?: () => void;
};

export function CreatePlanModal({
  open,
  onClose,
  placeId,
  placeName,
  onCreated,
}: CreatePlanModalProps) {
  const [title, setTitle] = useState('');
  const [planType, setPlanType] = useState<'personal' | 'group'>('personal');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [creating, setCreating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUserId(window.localStorage.getItem('phoneNumber'));
    }
  }, []);

  // Fetch user's groups
  const groupsQuery = useQuery<any[], Error>({
    queryKey: ['user-groups', currentUserId],
    enabled: Boolean(currentUserId && open),
    queryFn: async () => {
      const response = await fetch(`/api/groups?userId=${currentUserId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      return response.json();
    },
  });

  const handleCreate = async () => {
    if (!title.trim() || !currentUserId) return;

    setCreating(true);
    try {
      const response = await fetch(`/api/places/${placeId}/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          userId: currentUserId,
          groupId: planType === 'group' ? selectedGroupId : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create plan');
      }

      // Success
      setTitle('');
      setPlanType('personal');
      setSelectedGroupId('');
      onClose();
      onCreated?.();
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create plan. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating) {
      setTitle('');
      setPlanType('personal');
      setSelectedGroupId('');
      onClose();
    }
  };

  const canSubmit =
    title.trim().length > 0 &&
    (planType === 'personal' || (planType === 'group' && selectedGroupId));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'create-plan-modal__paper',
      }}
    >
      <Box className="create-plan-modal">
        <Stack spacing={3}>
          {/* Header */}
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Create Plan
            </Typography>
            <Button
              onClick={handleClose}
              disabled={creating}
              sx={{ minWidth: 'auto' }}
            >
              <Close />
            </Button>
          </Stack>

          <Typography
            variant="body2"
            sx={{ color: 'var(--color-text-secondary)' }}
          >
            Create a plan at <strong>{placeName}</strong>
          </Typography>

          {/* Plan Title */}
          <TextField
            label="Plan Title"
            placeholder="e.g., Friday Night Dinner"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            disabled={creating}
          />

          {/* Plan Type */}
          <FormControl component="fieldset" disabled={creating}>
            <FormLabel component="legend">Plan Type</FormLabel>
            <RadioGroup
              value={planType}
              onChange={(e) =>
                setPlanType(e.target.value as 'personal' | 'group')
              }
            >
              <FormControlLabel
                value="personal"
                control={<Radio />}
                label="Personal Plan"
              />
              <FormControlLabel
                value="group"
                control={<Radio />}
                label="Group Plan"
              />
            </RadioGroup>
          </FormControl>

          {/* Group Selection */}
          {planType === 'group' && (
            <FormControl fullWidth disabled={creating}>
              <FormLabel>Select Group</FormLabel>
              {groupsQuery.isLoading ? (
                <CircularProgress size={24} sx={{ mt: 1 }} />
              ) : (
                <Select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Choose a group...
                  </MenuItem>
                  {groupsQuery.data?.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          )}

          {/* Actions */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button onClick={handleClose} disabled={creating}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={!canSubmit || creating}
            >
              {creating ? 'Creating...' : 'Create Plan'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
}
