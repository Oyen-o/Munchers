// User Types
export interface User {
  id: string;
  phoneNumber: string;
  displayName?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;

}

// Group Types
export interface Group {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  members: GroupMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMember {
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}

// Event Types
export type EventStage = 'idea' | 'picked' | 'planned';

export interface Event {
  id: string;
  title: string;
  description?: string;
  time?: string;
  imageUrl?: string;
  stage: EventStage;
  ownerId: string; // User ID
  ownerType: 'user' | 'group';
  createdBy: string; // name
  groupId?: string; // If owned by group
  hostId?: string; // User hosting the event
  hostName?: string; // Name of the host
  plannedDate?: Date;
  location?: string;
  comments: Comment[];
  ratings: Rating[];
  createdAt: Date;
  updatedAt: Date;
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
