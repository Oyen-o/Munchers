const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:3001';

async function fetchFromBFF(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${BFF_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`BFF request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const stage = searchParams.get('stage');

  if (!userId) {
    return Response.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    let endpoint = `/api/events/user/${userId}`;
    if (stage) {
      endpoint += `?stage=${stage}`;
    }

    const events = await fetchFromBFF(endpoint);
    return Response.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = await fetchFromBFF('/api/events', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return Response.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return Response.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
