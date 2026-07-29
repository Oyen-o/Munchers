function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function toSafeDate(value: Date | string | undefined | null): Date | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return isValidDate(parsed) ? parsed : null;
}

// 2. Short Format (e.g., "Wed, Jul 22, 2026")
export function shortFormat(date: Date | string | undefined | null): string {
  const safeDate = toSafeDate(date);
  if (!safeDate) return 'Date not specified';

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(safeDate);
}

// Generate and download ICS calendar file for an event
export function downloadCalendarEvent(
  title: string,
  plannedDate: Date,
  description?: string,
  location?: string,
  eventId?: string
): void {
  // Format date for ICS file (YYYYMMDDTHHMMSS)
  const formatDateForICS = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  const startDate = new Date(plannedDate);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Munchers App//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART;TZID=America/Phoenix:${formatDateForICS(startDate)}`,
    `DTEND;TZID=America/Phoenix:${formatDateForICS(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description || ''}`,
    `LOCATION:${location || ''}`,
    `UID:${eventId || 'event'}@munchers.app`,
    `DTSTAMP:${formatDateForICS(new Date())}`,
    'STATUS:CONFIRMED',
    'BEGIN:VTIMEZONE',
    'TZID:America/Phoenix',
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:-0700',
    'TZOFFSETTO:-0700',
    'TZNAME:MST',
    'END:STANDARD',
    'END:VTIMEZONE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  // Create blob and download
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${title.replace(/\s+/g, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}