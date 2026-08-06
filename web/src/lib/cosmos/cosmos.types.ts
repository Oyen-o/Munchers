export type Visibility = 'public' | 'private' | 'friends';

export type GroupType = 'community' | 'friendGroup';

export type EventOwnerType = 'user' | 'group';

export type EventStageDocument = 'idea' | 'planned' | 'completed';

export type AttendanceStatus = 'invited' | 'going' | 'checkedIn' | 'cancelled';

export type RSVPStatus = 'going' | 'maybe' | 'notGoing';

export type FriendshipStatus = 'pending' | 'accepted' | 'blocked';

export interface BaseDocument {
	id: string;
	type: string;
	_etag?: string;
}

export interface UserSettingsDocument {
	publicProfile?: boolean;
}

export interface UserDocument extends BaseDocument {
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
	updatedAt?: string;
	settings?: UserSettingsDocument;
}

export interface EventLocationDocument {
	type?: string;
	latitude?: number;
	longitude?: number;
	address?: string;
}

export interface EventRecurrenceDocument {
	enabled?: boolean;
	frequency?: string;
	interval?: number;
	days?: string[];
}

export interface EventMetadataDocument {
	[key: string]: string | number | boolean | null | string[] | undefined;
}

export interface EventDocument extends BaseDocument {
	type: 'event';
	partitionKey: string;
	ownerId: string;
	ownerType?: EventOwnerType;
	stage?: EventStageDocument;
	groupId?: string | null;
	visibility?: Visibility;
	eventStyle?: string;
	title: string;
	description?: string;
	images?: string[];
	location?: EventLocationDocument | string;
	time?: string;
	startTime?: string;
	endTime?: string;
	coverImageUrl?: string;
	createdBy?: string;
	hostId?: string;
	hostName?: string;
	plannedDate?: string;
	capacity?: number;
	status?: string;
	recurrence?: EventRecurrenceDocument;
	metadata?: EventMetadataDocument;
	attendeeCount?: number;
	averageFriendRating?: number;
	averageCommunityRating?: number;
	createdAt: string;
	updatedAt?: string;
}

export interface GroupDocument extends BaseDocument {
	type: GroupType;
	name: string;
	description?: string;
	visibility?: Visibility;
	ownerId: string;
	image?: string;
    stats?: {
        memberCount?: number;
        eventCount?: number;
    };
	createdAt?: string;
	updatedAt?: string;
}

export interface MembershipDocument extends BaseDocument {
	type: 'membership';
	groupId: string;
	userId: string;
	role: 'admin' | 'member';
	joinedAt: string;
}

export interface FriendshipDocument extends BaseDocument {
	type: 'friendship';
	userId: string;
	friendId: string;
	status: FriendshipStatus;
	createdAt: string;
	updatedAt?: string;
}

export interface PlaceDocument extends BaseDocument {
	type: 'place';
	googlePlaceId: string;
	name: string;
	category: string;
	address: string;
	coordinates: {
		lat: number;
		lng: number;
	};
	phone?: string;
	website?: string;
	hours?: {
		[day: string]: string;
	};
	priceLevel?: number;
	isOpen?: boolean;
	createdAt: string;
	updatedAt?: string;
}

export interface PlaceRatingDocument extends BaseDocument {
	type: 'placeRating';
	placeId: string;
	userId: string;
	groupId?: string;
	rating: number;
	createdAt: string;
	updatedAt?: string;
}

export interface GroupListDocument extends BaseDocument {
	type: 'groupList';
	groupId: string;
	name: string;
	description?: string;
	visibility: 'public' | 'private';
	createdAt: string;
	updatedAt?: string;
}

export interface GroupListItemDocument extends BaseDocument {
	type: 'groupListItem';
	groupId: string;
	listId: string;
	entityId: string;
	rank: number;
	addedBy: string;
	notes?: string;
	createdAt: string;
	updatedAt?: string;
}

export interface AttendanceDocument extends BaseDocument {
	type: 'attendance';
	eventId: string;
	userId: string;
	status: AttendanceStatus;
	rsvp?: RSVPStatus;
	occurrenceDate?: string;
	checkedInCount?: number;
	lastCheckIn?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface RatingDocument extends BaseDocument {
	type: 'rating';
	eventId: string;
	userId: string;
	rating: number;
	comment?: string;
	createdAt: string;
	updatedAt?: string;
}

export interface CommentDocument extends BaseDocument {
	type: 'comment';
	eventId?: string;
	groupId?: string;
	userId: string;
	content: string;
	createdAt: string;
	updatedAt?: string;
}

export interface EventAvailabilityDocument extends BaseDocument {
	type: 'eventAvailability';
	eventId: string;
	userId: string;
	updatedAt: string;
	slots: string[];
}

export interface BrandSocialLinkDocument {
	platform: string;
	url: string;
}

export interface BrandDocument extends BaseDocument {
	type: 'brand';
	name: string;
	slug: string;
	description?: string;
	website?: string;
	logo?: string;
	banner?: string;
	verified?: boolean;
	ownerUserId?: string;
	ownerOrganizationId?: string;
	status?: string;
	socialLinks?: BrandSocialLinkDocument[];
	createdAt: string;
	updatedAt?: string;
}

export interface ExperienceDocument extends BaseDocument {
	type: 'experience';
	entityId: string;
	name: string;
	slug: string;
	category: string;
	description: string;
	createdBy: string;
	visibility: Visibility;
	coverPhoto: string;
	tags: string[];
	followers: number;
	createdAt: string;
	updatedAt: string;
}

export interface PlanDocument extends BaseDocument {
	type: 'plan';
	groupId: string;
	entityId: string;
	entityName?: string;
	entityPhoto?: string;
	entityCity?: string;
	experienceId: string;
	title: string;
	description: string;
	startsAt: string;
	endsAt: string;
	status: string;
	createdBy: string;
	attendeeCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface UserEntityDocument extends BaseDocument {
	type: 'userEntity';
	userId: string;
	entityId: string;
	relationship: string;
	createdAt: string;
}

export interface GroupEntityDocument extends BaseDocument {
	type: 'groupEntity';
	groupId: string;
	entityId: string;
	relationship: string;
	addedBy: string;
	createdAt: string;
}

export interface NotificationDocument extends BaseDocument {
	type: 'notification';
	ownerId: string;
	title: string;
	message: string;
	read?: boolean;
	ttl?: number;
	createdAt: string;
}

export interface ActivityFeedDocument extends BaseDocument {
	type: 'activityFeed';
	ownerId: string;
	actorId: string;
	activityType: string;
	entityId?: string;
	entityType?: string;
	payload?: Record<string, unknown>;
	createdAt: string;
	ttl?: number;
}

export interface CosmosContainerPartitionKeyDocument {
	users: '/id';
	events: '/partitionKey';
	groups: '/id';
	memberships: '/groupId';
	attendances: '/eventId';
	comments: '/eventId';
	eventAvailability: '/eventId';
	ratings: '/eventId';
	friendships: '/userId';
	activityFeed: '/ownerId';
}
