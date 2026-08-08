import { NextRequest, NextResponse } from 'next/server';
import { getAttendancesContainer } from 'src/lib/cosmos/cosmos';
import { AttendanceDocument } from 'src/lib/cosmos/cosmos.types';


// Get attendees for a specific event/plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: eventId } = await params;

    const container = getAttendancesContainer();
    
    // Query all attendances for this event
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.eventId = @eventId AND c.type = @type',
      parameters: [
        { name: '@eventId', value: eventId },
        { name: '@type', value: 'attendance' },
      ],
    };

    const { resources: attendances } = await container.items
      .query<AttendanceDocument>(querySpec, { partitionKey: eventId })
      .fetchAll();

    // Extract user IDs from attendances
    const attendeeIds = attendances.map((attendance) => attendance.userId);

    return NextResponse.json({ attendeeIds });
  } catch (error) {
    console.error('Error fetching attendees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendees' },
      { status: 500 },
    );
  }
}

// Join an event (RSVP)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: eventId } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 },
      );
    }

    const container = getAttendancesContainer();

    // Check if user is already attending
    const checkQuery = {
      query: 'SELECT * FROM c WHERE c.eventId = @eventId AND c.userId = @userId AND c.type = @type',
      parameters: [
        { name: '@eventId', value: eventId },
        { name: '@userId', value: userId },
        { name: '@type', value: 'attendance' },
      ],
    };

    const { resources: existing } = await container.items
      .query<AttendanceDocument>(checkQuery, { partitionKey: eventId })
      .fetchAll();

    if (existing.length > 0) {
      // User already attending, return success
      const querySpec = {
        query: 'SELECT c.userId FROM c WHERE c.eventId = @eventId AND c.type = @type',
        parameters: [
          { name: '@eventId', value: eventId },
          { name: '@type', value: 'attendance' },
        ],
      };

      const { resources: attendances } = await container.items
        .query<AttendanceDocument>(querySpec, { partitionKey: eventId })
        .fetchAll();

      const attendeeIds = attendances.map((a) => a.userId);

      return NextResponse.json(
        {
          success: true,
          message: 'Already joined event',
          eventId,
          userId,
          attendeeIds,
        },
        { status: 200 },
      );
    }

    // Create new attendance record
    const newAttendance: AttendanceDocument = {
      id: `${eventId}-${userId}`,
      type: 'attendance',
      eventId,
      userId,
      status: 'going',
      rsvp: 'going',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await container.items.create(newAttendance);

    // Get updated attendee list
    const querySpec = {
      query: 'SELECT c.userId FROM c WHERE c.eventId = @eventId AND c.type = @type',
      parameters: [
        { name: '@eventId', value: eventId },
        { name: '@type', value: 'attendance' },
      ],
    };

    const { resources: attendances } = await container.items
      .query<AttendanceDocument>(querySpec, { partitionKey: eventId })
      .fetchAll();

    const attendeeIds = attendances.map((a) => a.userId);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined event',
        eventId,
        userId,
        attendeeIds,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error joining event:', error);
    return NextResponse.json(
      { error: 'Failed to join event' },
      { status: 500 },
    );
  }
}

// Leave an event (cancel RSVP)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: eventId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 },
      );
    }

    const container = getAttendancesContainer();
    const attendanceId = `${eventId}-${userId}`;

    // Delete the attendance record
    try {
      await container.item(attendanceId, eventId).delete();
    } catch (deleteError: any) {
      // If not found, that's okay - user wasn't attending
      if (deleteError.code !== 404) {
        throw deleteError;
      }
    }

    // Get updated attendee list
    const querySpec = {
      query: 'SELECT c.userId FROM c WHERE c.eventId = @eventId AND c.type = @type',
      parameters: [
        { name: '@eventId', value: eventId },
        { name: '@type', value: 'attendance' },
      ],
    };

    const { resources: attendances } = await container.items
      .query<AttendanceDocument>(querySpec, { partitionKey: eventId })
      .fetchAll();

    const attendeeIds = attendances.map((a) => a.userId);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully left event',
        eventId,
        userId,
        attendeeIds,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error leaving event:', error);
    return NextResponse.json(
      { error: 'Failed to leave event' },
      { status: 500 },
    );
  }
}
