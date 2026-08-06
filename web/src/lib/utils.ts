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

type CalendarEventActionInput = {
  title: string;
  plannedDate: Date;
  description?: string;
  location?: string;
  eventId?: string;
};

export function openCalendarEventByBrowser({
  title,
  plannedDate,
  description,
  location,
  eventId,
}: CalendarEventActionInput): void {
  if (Number.isNaN(plannedDate.getTime())) {
    return;
  }

  const nav = typeof navigator !== 'undefined' ? navigator : null;
  const userAgent = nav?.userAgent ?? '';
  const ua = userAgent.toLowerCase();

  const brands =
    // userAgentData is not typed in all TS lib versions.
    ((nav as Navigator & {
      userAgentData?: { brands?: Array<{ brand: string; version: string }> };
    })?.userAgentData?.brands ?? []);

  const isChromeFromBrands = brands.some((entry) => {
    const brand = entry.brand.toLowerCase();
    return brand.includes('google chrome') || brand.includes('chromium');
  });

  const looksLikeChrome =
    ua.includes('chrome/') || ua.includes('crios/') || ua.includes('chromium/');
  const isExcludedBrowser =
    ua.includes('edg/') ||
    ua.includes('edga/') ||
    ua.includes('edgios/') ||
    ua.includes('opr/') ||
    ua.includes('opios/') ||
    ua.includes('samsungbrowser/') ||
    ua.includes('firefox/') ||
    ua.includes('fxios/') ||
    ua.includes('duckduckgo/');

  const isChromeBrowser = (isChromeFromBrands || looksLikeChrome) && !isExcludedBrowser;

  if (isChromeBrowser) {
    console.log('Opening Google Calendar event in Chrome browser...');
    const endDate = new Date(plannedDate.getTime() + 2 * 60 * 60 * 1000);
    const toGoogleCalendarDate = (value: Date) =>
      value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    const calendarUrl = new URL('https://calendar.google.com/calendar/render');
    calendarUrl.searchParams.set('action', 'TEMPLATE');
    calendarUrl.searchParams.set('text', title);
    calendarUrl.searchParams.set(
      'dates',
      `${toGoogleCalendarDate(plannedDate)}/${toGoogleCalendarDate(endDate)}`,
    );
    if (description) {
      calendarUrl.searchParams.set('details', description);
    }
    if (location) {
      calendarUrl.searchParams.set('location', location);
    }

    window.open(calendarUrl.toString(), '_blank', 'noopener,noreferrer');
    return;
  }

  // Safari and non-Chrome browsers keep ICS download behavior.
  downloadCalendarEvent(title, plannedDate, description, location, eventId);
}

/**
 * Get the rating image path based on the rating value
 * @param rating - The rating value (1-5)
 * @returns The path to the rating image
 */
export function getRatingImage(rating: number): string {
  if (rating >= 4.5) return '/ratings/rating-5.png';
  if (rating >= 4) return '/ratings/rating-4.png';
  if (rating >= 3) return '/ratings/rating-3.png';
  if (rating >= 2) return '/ratings/rating-2.png';
  return '/ratings/rating-1.png';
}