// User Types
export interface User {
  id: string;
  type: 'user';
  username: string;
  displayName: string;
  profileImage?: string;
  bio?: string;
  points?: number;
  level?: number;
  friendCount?: number;
  communityCount?: number;
  eventCount?: number;
  createdAt: string;
  settings?: {
    publicProfile?: boolean;
  };
  phoneNumber?: string;
  profilePicture?: string;
  updatedAt?: Date;
}

// Group Types
export interface Group {
  id: string;
  type?: 'community';
  name: string;
  description?: string;
  visibility?: 'public' | 'private' | 'friends';
  ownerId?: string;
  image?: string;
  memberCount?: number;
  eventCount?: number;
  createdBy?: string;
  members?: GroupMember[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface GroupMember {
  id?: string;
  groupId?: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt?: Date | string;
}

// Event Types
export type EventStage = 'idea' | 'picked' | 'planned';

export enum EventType {
  Foodie = 'foodie',
  Hiking = 'adventure',
  Sports = 'sports',
  Movie = 'entertainment',
  Gaming = 'gaming',
  Running = 'running',
  Other = 'other',
}

export const EventTypeLabels: Record<EventType, string> = {
  [EventType.Foodie]: 'Foodie',
  [EventType.Hiking]: 'Hiking',
  [EventType.Sports]: 'Sports',
  [EventType.Movie]: 'Movie',
  [EventType.Gaming]: 'Gaming',
  [EventType.Running]: 'Running',
  [EventType.Other]: 'Other',
};

export interface Event {
  hostAvatarUrl?: string;
  id: string;
  partitionKey?: string;
  type?: 'event';
  ownerId: string; // User ID
  groupId?: string | null; // If owned by group
  visibility?: 'public' | 'private' | 'friends';
  eventStyle?: string;
  title: string;
  description?: string;
  images?: string[];
  location?: {
    type?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
  } | string;
  time?: string;
  startTime?: string;
  endTime?: string;
  imageUrl?: string;
  stage: EventStage;
  ownerType?: 'user' | 'group';
  createdBy?: string; // name
  hostId?: string; // User hosting the event
  hostName?: string; // Name of the host
  plannedDate?: Date;
  capacity?: number;
  status?: string;
  recurrence?: {
    enabled?: boolean;
    frequency?: string;
    interval?: number;
    days?: string[];
  };
  attendeeCount?: number;
  averageFriendRating?: number;
  averageCommunityRating?: number;
  comments: Comment[];
  ratings: Rating[];
  createdAt: Date | string;
  updatedAt?: Date | string;
  _etag?: string;
}

// Comment Types
export interface Comment {
  id: string;
  eventId?: string;
  groupId?: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Rating Types
export interface Rating {
  id: string;
  eventId: string;
  userId: string;
  value: number; // 1-5
  createdAt: Date;
}

// Idea Types (Events in 'idea' stage)
export interface Idea extends Event {
  stage: 'idea';
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: string;
}

export interface Attendance {
  id: string;
  eventId: string;
  userId: string;
  status: 'invited' | 'going' | 'checkedIn' | 'cancelled';
  rsvp?: 'going' | 'maybe' | 'notGoing';
  checkedInCount?: number;
  lastCheckIn?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
