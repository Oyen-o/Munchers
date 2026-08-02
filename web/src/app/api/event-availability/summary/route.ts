import { getEventAvailabilitySummary } from '../../../../lib/services/event-availability-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId')?.trim();

  if (!eventId) {
    return Response.json({ error: 'eventId is required' }, { status: 400 });
  }

  try {
    const summary = await getEventAvailabilitySummary(eventId);
    return Response.json(summary);
  } catch (error) {
    console.error('Error fetching event availability summary:', error);
    return Response.json(
      { error: 'Failed to fetch event availability summary' },
      { status: 500 },
    );
  }
}
