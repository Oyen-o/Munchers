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
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } =await params;
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
