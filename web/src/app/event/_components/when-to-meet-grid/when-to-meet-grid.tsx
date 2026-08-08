'use client';

import { Fragment } from 'react';
import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { Add as AddIcon } from '@mui/icons-material';
import { Check as CheckIcon } from '@mui/icons-material';
import { DeleteOutline as DeleteOutlineIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  WHEN_TO_MEET_DAYS,
  WHEN_TO_MEET_DEFAULT_DAYS,
  WHEN_TO_MEET_GRID,
  WHEN_TO_MEET_PERIODS,
  WHEN_TO_MEET_SLOTS,
  isWhenToMeetWeekendDay,
  type WhenToMeetDay,
  type WhenToMeetSlot,
} from 'src/lib/availability/when-to-meet-slots';

import './when-to-meet-grid.scss';

type WhenToMeetGridProps = {
  selectedSlots: WhenToMeetSlot[];
  counts: Partial<Record<WhenToMeetSlot, number>>;
  totalResponses: number;
  onToggle: (slot: WhenToMeetSlot) => void;
  visibleDays?: WhenToMeetDay[];
  dayLabels?: Partial<Record<WhenToMeetDay, string>>;
  onAddDay?: (day: WhenToMeetDay) => void;
  onRemoveDay?: (day: WhenToMeetDay) => void;
  disabled?: boolean;
};

const WHEN_TO_MEET_PERIOD_SHORT_LABELS = ['AM', 'PM', 'EVE'] as const;

function getHeatColor(
  slotCount: number,
  totalResponses: number,
  maxCount: number,
): string {
  if (slotCount <= 0 || totalResponses <= 0) {
    return '#d94b4b';
  }

  if (slotCount === maxCount && maxCount > 0) {
    return '#0f7a1f';
  }

  const percentage = (slotCount / totalResponses) * 100;

  if (percentage <= 20) return '#d8f3dc';
  if (percentage <= 40) return '#95d5b2';
  if (percentage <= 60) return '#52b788';
  if (percentage <= 80) return '#2d9b52';
  return '#0f7a1f';
}

export function WhenToMeetGrid({
  selectedSlots,
  counts,
  totalResponses,
  onToggle,
  visibleDays,
  dayLabels,
  onAddDay,
  onRemoveDay,
  disabled = false,
}: WhenToMeetGridProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // Calculate days with at least one vote
  const daysWithVotes = useMemo(() => {
    return WHEN_TO_MEET_DAYS.filter((day) => {
      const slotsForDay = WHEN_TO_MEET_GRID[day];
      return slotsForDay.some((slot) => (counts[slot] ?? 0) > 0);
    });
  }, [counts]);

  // Combine visible days, default days, and days with votes
  const activeDays = useMemo(() => {
    if (visibleDays && visibleDays.length > 0) {
      // If visibleDays is provided, merge with days that have votes
      const uniqueDays = Array.from(
        new Set([...visibleDays, ...daysWithVotes])
      );
      // Sort in correct order
      return uniqueDays.sort((a, b) => {
        return WHEN_TO_MEET_DAYS.indexOf(a) - WHEN_TO_MEET_DAYS.indexOf(b);
      });
    }
    // Default: combine default days with days that have votes
    const uniqueDays = Array.from(
      new Set([...WHEN_TO_MEET_DEFAULT_DAYS, ...daysWithVotes])
    );
    return uniqueDays.sort((a, b) => {
      return WHEN_TO_MEET_DAYS.indexOf(a) - WHEN_TO_MEET_DAYS.indexOf(b);
    });
  }, [visibleDays, daysWithVotes]);

  const remainingDays = useMemo(
    () => WHEN_TO_MEET_DAYS.filter((day) => !activeDays.includes(day)),
    [activeDays],
  );

  const selected = new Set(selectedSlots);
  const maxCount = Math.max(
    0,
    ...WHEN_TO_MEET_SLOTS.map((slot) => counts[slot] ?? 0),
  );

  const handleAddDayClick = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleSelectDay = (day: WhenToMeetDay) => {
    onAddDay?.(day);
    setMenuAnchor(null);
  };

  const getDayLabel = (day: WhenToMeetDay) => dayLabels?.[day] ?? day;

  return (
    <Box className="when-to-meet-grid">
      <Box className="when-to-meet-grid__table">
        <Box className="when-to-meet-grid__header-spacer" />
        {WHEN_TO_MEET_PERIODS.map((period) => (
          <Typography
            key={period}
            variant="caption"
            className="when-to-meet-grid__header"
          >
            <span className="when-to-meet-grid__header-label when-to-meet-grid__header-label--full">
              {period}
            </span>
            <span className="when-to-meet-grid__header-label when-to-meet-grid__header-label--short">
              {
                WHEN_TO_MEET_PERIOD_SHORT_LABELS[
                  WHEN_TO_MEET_PERIODS.indexOf(period)
                ]
              }
            </span>
          </Typography>
        ))}
        <Box className="when-to-meet-grid__header-spacer" />

        {activeDays.map((day) => (
          <Fragment key={day}>
            <Typography
              variant="caption"
              className="when-to-meet-grid__day-label"
            >
              {getDayLabel(day)}
            </Typography>
            {WHEN_TO_MEET_GRID[day].map((slot) => {
              const slotCount = counts[slot] ?? 0;
              const isSelected = selected.has(slot);
              const heatColor = getHeatColor(
                slotCount,
                totalResponses,
                maxCount,
              );

              return (
                <button
                  key={slot}
                  type="button"
                  className={`when-to-meet-grid__cell${isSelected ? ' when-to-meet-grid__cell--selected' : ''}`}
                  style={{ backgroundColor: heatColor }}
                  onClick={() => onToggle(slot)}
                  disabled={disabled}
                  aria-pressed={isSelected}
                  aria-label={`${slot} (${slotCount} selections)`}
                >
                  {isSelected ? (
                    <span className="when-to-meet-grid__cell-content">
                      <CheckIcon className="when-to-meet-grid__check" />
                    </span>
                  ) : null}
                  <span className="when-to-meet-grid__vote-count">
                    {slotCount}
                  </span>
                </button>
              );
            })}
            <Box className="when-to-meet-grid__remove-cell">
              {onRemoveDay && !isWhenToMeetWeekendDay(day) ? (
                <Tooltip title={`Remove ${getDayLabel(day)}`}>
                  <span>
                    <IconButton
                      className="when-to-meet-grid__remove-day"
                      size="small"
                      onClick={() => onRemoveDay(day)}
                      disabled={disabled}
                      aria-label={`Remove ${getDayLabel(day)}`}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : null}
            </Box>
          </Fragment>
        ))}
      </Box>

      {onAddDay && (
        <>
          <Button
            className="when-to-meet-grid__add-day"
            variant="outlined"
            fullWidth
            size="small"
            onClick={handleAddDayClick}
            disabled={disabled || remainingDays.length === 0}
          >
            Add Day
          </Button>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleCloseMenu}
          >
            {remainingDays.map((day) => (
              <MenuItem key={day} onClick={() => handleSelectDay(day)}>
                {getDayLabel(day)}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}

      <Typography variant="caption" className="when-to-meet-grid__footnote">
        {totalResponses} response{totalResponses === 1 ? '' : 's'}
      </Typography>
    </Box>
  );
}
