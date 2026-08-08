import { NextRequest, NextResponse } from 'next/server';

// Mock place data for now
const mockPlaces: Record<string, any> = {
  '1': {
    id: '1',
    type: 'place',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    name: 'The Golden Spoon',
    category: 'Restaurant',
    address: '123 Main St, Seattle, WA 98101',
    coordinates: {
      lat: 47.6062,
      lng: -122.3321,
    },
    phone: '(206) 555-1234',
    website: 'https://goldenspo on.example.com',
    hours: {
      Monday: '11:00 AM - 9:00 PM',
      Tuesday: '11:00 AM - 9:00 PM',
      Wednesday: '11:00 AM - 9:00 PM',
      Thursday: '11:00 AM - 9:00 PM',
      Friday: '11:00 AM - 10:00 PM',
      Saturday: '10:00 AM - 10:00 PM',
      Sunday: '10:00 AM - 8:00 PM',
    },
    priceLevel: 2,
    isOpen: true,
    createdAt: new Date().toISOString(),
  },
  '2': {
    id: '2',
    type: 'place',
    googlePlaceId: 'ChIJScottsdaleParkAZ',
    name: 'Scottsdale Ranch Park Volleyball Courts',
    category: 'Outdoor Volleyball Courts',
    address: 'Scottsdale Ranch Park, 10400 E Via Linda, Scottsdale, AZ',
    coordinates: {
      lat: 33.6189,
      lng: -111.8910,
    },
    phone: null,
    website: null,
    hours: {
      Monday: '6:00 AM - 10:00 PM',
      Tuesday: '6:00 AM - 10:00 PM',
      Wednesday: '6:00 AM - 10:00 PM',
      Thursday: '6:00 AM - 10:00 PM',
      Friday: '6:00 AM - 10:00 PM',
      Saturday: '6:00 AM - 10:00 PM',
      Sunday: '6:00 AM - 10:00 PM',
    },
    priceLevel: 0,
    isOpen: true,
    tags: ['Outdoor', 'Volleyball', 'Sports', 'Pickup Games', 'Tournament', 'Community'],
    createdAt: new Date().toISOString(),
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log('Fetching place with ID:', id);
    const place = mockPlaces[id];

    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(place);
  } catch (error) {
    console.error('Error fetching place:', error);
    return NextResponse.json(
      { error: 'Failed to fetch place' },
      { status: 500 },
    );
  }
}
