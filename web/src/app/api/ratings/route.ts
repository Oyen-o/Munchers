import { getRatingsContainer } from '../../../lib/cosmos/cosmos';
import type { RatingDocument } from '../../../lib/cosmos/cosmos.types';

function isValidRating(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 5;
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get('userId')?.trim();
	const eventId = searchParams.get('eventId')?.trim();

	if (!userId) {
		return Response.json({ error: 'userId is required' }, { status: 400 });
	}

	try {
		const ratingsContainer = getRatingsContainer();
		let query = 'SELECT * FROM c WHERE c.type = "rating" AND c.userId = @userId';
		const parameters: { name: string; value: string }[] = [{ name: '@userId', value: userId }];

		if (eventId) {
			query += ' AND c.eventId = @eventId';
			parameters.push({ name: '@eventId', value: eventId });
		}

		query += ' ORDER BY c.createdAt DESC';

		const { resources } = await ratingsContainer.items
			.query<RatingDocument>({ query, parameters })
			.fetchAll();

		return Response.json(resources);
	} catch (error) {
		console.error('Error fetching ratings:', error);
		return Response.json({ error: 'Failed to fetch ratings' }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as Partial<RatingDocument>;
		const userId = body.userId?.trim();
		const eventId = body.eventId?.trim();
		const ratingValue = body.rating;

		if (!userId || !eventId || !isValidRating(ratingValue)) {
			return Response.json(
				{ error: 'userId, eventId, and rating (1-5) are required' },
				{ status: 400 }
			);
		}

		const ratingsContainer = getRatingsContainer();

		const { resources: existingRatings } = await ratingsContainer.items
			.query<RatingDocument>({
				query: 'SELECT * FROM c WHERE c.type = "rating" AND c.userId = @userId AND c.eventId = @eventId',
				parameters: [
					{ name: '@userId', value: userId },
					{ name: '@eventId', value: eventId },
				],
			})
			.fetchAll();

		const now = new Date().toISOString();

		if (existingRatings.length > 0) {
			const existing = existingRatings[0];
			const updatedRating: RatingDocument = {
				...existing,
				rating: ratingValue,
				updatedAt: now,
			};

			const { resource } = await ratingsContainer
				.item(updatedRating.id, updatedRating.eventId)
				.replace<RatingDocument>(updatedRating);

			return Response.json(resource);
		}

		const newRating: RatingDocument = {
			id: `rating_${Date.now()}`,
			type: 'rating',
			userId,
			eventId,
			rating: ratingValue,
			createdAt: now,
			updatedAt: now,
		};

		const { resource } = await ratingsContainer.items.create<RatingDocument>(newRating);
		return Response.json(resource, { status: 201 });
	} catch (error) {
		console.error('Error upserting rating:', error);
		return Response.json({ error: 'Failed to upsert rating' }, { status: 500 });
	}
}
