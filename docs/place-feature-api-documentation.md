# Place Feature API Documentation

## Overview

The Place feature requires several API endpoints to support place details, community ratings, and plan management. Currently, all endpoints return mock data. This document outlines what each endpoint should do in production.

---

## 1. GET /api/places/[id]

**Purpose**: Fetch details for a specific place.

**Current Status**: ✅ Created with mock data

**Request**:

```
GET /api/places/1
```

**Response**:

```json
{
  "id": "1",
  "type": "place",
  "googlePlaceId": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "name": "The Golden Spoon",
  "category": "Restaurant",
  "address": "123 Main St, Seattle, WA 98101",
  "coordinates": {
    "lat": 47.6062,
    "lng": -122.3321
  },
  "phone": "(206) 555-1234",
  "website": "https://goldenspoon.example.com",
  "hours": {
    "Monday": "11:00 AM - 9:00 PM",
    "Tuesday": "11:00 AM - 9:00 PM",
    ...
  },
  "priceLevel": 2,
  "isOpen": true,
  "createdAt": "2026-08-05T10:00:00Z"
}
```

**Production Requirements**:

- Query Cosmos DB by place ID
- If place doesn't exist, optionally fetch from Google Places API and cache
- Store PlaceDocument in database
- Return standardized Place object

**Cosmos Query**:

```typescript
const placeContainer = cosmosClient.database('munchers').container('places');
const { resource } = await placeContainer.item(id, id).read<PlaceDocument>();
```

---

## 2. GET /api/places/[id]/ratings

**Purpose**: Fetch community ratings aggregated by friends, user's groups, and popular groups.

**Current Status**: ✅ Created with mock data

**Request**:

```
GET /api/places/1/ratings?userId=user123
```

**Response**:

```json
{
  "friends": {
    "average": 4.3,
    "count": 12
  },
  "userGroups": [
    {
      "groupId": "group1",
      "groupName": "Seattle Foodies",
      "average": 4.5,
      "count": 24
    }
  ],
  "popularGroups": [
    {
      "groupId": "group3",
      "groupName": "Pacific Northwest Food Lovers",
      "average": 4.6,
      "count": 156
    }
  ]
}
```

**Production Requirements**:

### Friends Rating

1. Get user's friend list from FriendshipDocument
2. Query PlaceRatingDocument where userId IN friendIds AND placeId = place.id
3. Calculate average and count

```typescript
// Get friendships
const friendships = await container.items
  .query({
    query: `SELECT c.friendId FROM c WHERE c.type = 'friendship' 
            AND c.userId = @userId AND c.status = 'accepted'`,
    parameters: [{ name: '@userId', value: userId }],
  })
  .fetchAll();

const friendIds = friendships.resources.map((f) => f.friendId);

// Get friend ratings
const ratings = await container.items
  .query({
    query: `SELECT AVG(c.rating) as average, COUNT(1) as count 
            FROM c WHERE c.type = 'placeRating' 
            AND c.placeId = @placeId 
            AND c.userId IN (@friendIds)`,
    parameters: [
      { name: '@placeId', value: placeId },
      { name: '@friendIds', value: friendIds },
    ],
  })
  .fetchAll();
```

### User Groups Rating

1. Get user's group memberships from MembershipDocument
2. For each group, query PlaceRatingDocument where placeId = place.id and userId IN group members
3. Calculate average and count per group
4. Sort by count DESC

```typescript
// Get user's groups
const memberships = await container.items
  .query({
    query: `SELECT c.groupId FROM c WHERE c.type = 'membership' 
            AND c.userId = @userId`,
    parameters: [{ name: '@userId', value: userId }],
  })
  .fetchAll();

// For each group, get ratings
const groupRatings = await Promise.all(
  memberships.resources.map(async (membership) => {
    const groupMembers = await getGroupMembers(membership.groupId);
    const ratings = await container.items
      .query({
        query: `SELECT AVG(c.rating) as average, COUNT(1) as count 
                FROM c WHERE c.type = 'placeRating' 
                AND c.placeId = @placeId 
                AND c.userId IN (@memberIds)`,
        parameters: [
          { name: '@placeId', value: placeId },
          { name: '@memberIds', value: groupMembers },
        ],
      })
      .fetchAll();

    return {
      groupId: membership.groupId,
      groupName: await getGroupName(membership.groupId),
      average: ratings.resources[0].average,
      count: ratings.resources[0].count,
    };
  }),
);
```

### Popular Community Ratings

1. Query all PlaceRatingDocument for this placeId
2. Group by groupId (if groupId exists)
3. Calculate average and count per group
4. Sort by count DESC
5. Return top 10

```typescript
const popularRatings = await container.items
  .query({
    query: `SELECT c.groupId, AVG(c.rating) as average, COUNT(1) as count 
            FROM c WHERE c.type = 'placeRating' 
            AND c.placeId = @placeId 
            AND IS_DEFINED(c.groupId)
            GROUP BY c.groupId
            ORDER BY COUNT(1) DESC
            OFFSET 0 LIMIT 10`,
    parameters: [{ name: '@placeId', value: placeId }],
  })
  .fetchAll();

// Enrich with group names
const popularGroups = await Promise.all(
  popularRatings.resources.map(async (rating) => ({
    ...rating,
    groupName: await getGroupName(rating.groupId),
  })),
);
```

---

## 3. POST /api/places/[id]/ratings

**Purpose**: Create a new rating for a place.

**Current Status**: ✅ Created with mock response

**Request**:

```json
POST /api/places/1/ratings
{
  "userId": "user123",
  "groupId": "group1", // optional
  "rating": 5
}
```

**Response**:

```json
{
  "id": "rating_1722859200000",
  "placeId": "1",
  "userId": "user123",
  "groupId": "group1",
  "rating": 5,
  "createdAt": "2026-08-05T10:00:00Z"
}
```

**Production Requirements**:

- Validate userId, placeId, rating (1-5)
- Check if user already rated this place (update vs. create)
- Create PlaceRatingDocument
- Store in Cosmos DB

```typescript
const ratingDocument: PlaceRatingDocument = {
  id: `rating_${Date.now()}`,
  type: 'placeRating',
  placeId,
  userId,
  groupId: groupId || undefined,
  rating,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

await container.items.create(ratingDocument);
```

---

## 4. GET /api/places/[id]/plans

**Purpose**: Fetch all plans (events) at this place.

**Current Status**: ✅ Created with mock data

**Request**:

```
GET /api/places/1/plans
```

**Response**:

```json
[
  {
    "id": "plan1",
    "title": "Friday Night Dinner",
    "placeId": "1",
    "createdBy": "user123",
    "creatorName": "Sarah Chen",
    "groupId": "group1",
    "groupName": "Seattle Foodies",
    "plannedDate": "2026-08-07T19:00:00Z",
    "stage": "idea",
    "attendeeCount": 5,
    "createdAt": "2026-08-05T10:00:00Z"
  }
]
```

**Production Requirements**:

- Query EventDocument where location matches place
- Need to handle both string and object location formats
- Filter by placeId if we add placeId field to Event
- Sort by plannedDate

**Recommended Approach**:
Add `placeId` field to EventDocument for easier querying.

```typescript
// Option 1: If placeId exists on Event
const plans = await container.items
  .query({
    query: `SELECT * FROM c WHERE c.type = 'event' 
            AND c.placeId = @placeId 
            ORDER BY c.plannedDate ASC`,
    parameters: [{ name: '@placeId', value: placeId }],
  })
  .fetchAll();

// Option 2: If no placeId, search by location
const plans = await container.items
  .query({
    query: `SELECT * FROM c WHERE c.type = 'event' 
            AND (c.location.address = @address 
            OR CONTAINS(c.location, @address))
            ORDER BY c.plannedDate ASC`,
    parameters: [{ name: '@address', value: place.address }],
  })
  .fetchAll();
```

**Enhancement**:
Update Event type to include optional `placeId` field:

```typescript
export interface Event {
  // ... existing fields
  placeId?: string; // NEW: Reference to Place
}
```

---

## 5. POST /api/places/[id]/plans

**Purpose**: Create a new plan at this place.

**Current Status**: ✅ Created with mock response

**Request**:

```json
POST /api/places/1/plans
{
  "title": "Friday Night Dinner",
  "userId": "user123",
  "groupId": "group1",  // optional
  "plannedDate": "2026-08-07T19:00:00Z"  // optional
}
```

**Response**:

```json
{
  "id": "plan_1722859200000",
  "title": "Friday Night Dinner",
  "placeId": "1",
  "createdBy": "user123",
  "groupId": "group1",
  "plannedDate": "2026-08-07T19:00:00Z",
  "stage": "idea",
  "attendeeCount": 1,
  "createdAt": "2026-08-05T10:00:00Z"
}
```

**Production Requirements**:

- Create EventDocument with stage = 'idea'
- Set location to place details
- Set placeId reference
- Initialize with creator as first attendee

```typescript
const place = await getPlace(placeId);

const eventDocument: EventDocument = {
  id: `event_${Date.now()}`,
  type: 'event',
  partitionKey: userId,
  ownerId: userId,
  ownerType: groupId ? 'group' : 'user',
  groupId: groupId || null,
  title,
  stage: 'idea',
  placeId: placeId, // NEW FIELD
  location: {
    type: 'Point',
    latitude: place.coordinates.lat,
    longitude: place.coordinates.lng,
    address: place.address,
  },
  plannedDate: plannedDate || undefined,
  attendeeCount: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

await container.items.create(eventDocument);
```

---

## Additional Enhancements

### 1. Google Places API Integration

Create a service to fetch place details from Google Places API:

```typescript
// web/src/lib/services/google-places-service.ts

export async function searchPlaces(query: string) {
  // Call Google Places Text Search API
  // Return list of places
}

export async function getPlaceDetails(googlePlaceId: string) {
  // Call Google Places Details API
  // Return full place information
}

export async function syncPlaceToDatabase(googlePlaceId: string) {
  const details = await getPlaceDetails(googlePlaceId);

  const placeDocument: PlaceDocument = {
    id: generateId(),
    type: 'place',
    googlePlaceId: details.place_id,
    name: details.name,
    category: details.types[0],
    address: details.formatted_address,
    coordinates: {
      lat: details.geometry.location.lat,
      lng: details.geometry.location.lng,
    },
    phone: details.formatted_phone_number,
    website: details.website,
    hours: parseOpeningHours(details.opening_hours),
    priceLevel: details.price_level,
    isOpen: details.opening_hours?.open_now,
    createdAt: new Date().toISOString(),
  };

  await savePlaceToDatabase(placeDocument);
  return placeDocument;
}
```

### 2. Place Search Endpoint

```typescript
// web/src/app/api/places/search/route.ts

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category'); // 'food-drink', etc.

  // Search local database first
  const localPlaces = await searchLocalPlaces(query, category);

  // If not enough results, search Google Places
  if (localPlaces.length < 5) {
    const googlePlaces = await searchGooglePlaces(query, category);
    // Cache results to database
    await cacheGooglePlaces(googlePlaces);
  }

  return NextResponse.json(localPlaces);
}
```

### 3. User Rating Check

Add endpoint to check if user has already rated a place:

```typescript
// web/src/app/api/places/[id]/ratings/user/route.ts

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // Check if user already rated this place
  const existingRating = await findUserRating(params.id, userId);

  return NextResponse.json(existingRating || null);
}
```

---

## Database Schema Updates

### Add placeId to Event

Update EventDocument to include place reference:

```typescript
export interface EventDocument extends BaseDocument {
  // ... existing fields
  placeId?: string; // NEW: Optional reference to Place
}
```

### Add Indexes

For efficient querying, add these Cosmos DB indexes:

1. **PlaceRatingDocument**:
   - Index on `placeId`
   - Index on `userId`
   - Index on `groupId`
   - Composite index on `(placeId, groupId)`

2. **EventDocument**:
   - Index on `placeId` (new field)
   - Composite index on `(placeId, plannedDate)`

---

## Summary

✅ **Already Created**:

- All API route files with mock data
- Full frontend components
- Type definitions

🔨 **Production TODO**:

1. Replace mock data with Cosmos DB queries
2. Implement Google Places API integration
3. Add place search functionality
4. Add placeId field to Event schema
5. Create database indexes for performance
6. Add user rating check endpoint
7. Implement rating updates (vs. always creating new)

📋 **Testing Checklist**:

- [ ] Place details load correctly
- [ ] Community ratings aggregate properly
- [ ] Friends ratings show only accepted friendships
- [ ] User groups ratings exclude groups user left
- [ ] Popular groups limited to top 10
- [ ] Plans created with 'idea' stage
- [ ] Plans link to place correctly
- [ ] Create plan modal shows user's groups
- [ ] Personal vs. group plan creation works
