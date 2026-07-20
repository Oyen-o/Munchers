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

  if (!userId) {
    return Response.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const groups = await fetchFromBFF(`/api/groups/user/${userId}`);
    return Response.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return Response.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const group = await fetchFromBFF('/api/groups', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return Response.json(group, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return Response.json({ error: 'Failed to create group' }, { status: 500 });
  }
}
