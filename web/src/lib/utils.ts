// 2. Short Format (e.g., "Wed, Jul 22, 2026")
export function shortFormat(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}