import { Router } from 'express';
import { getContainers } from '../db/cosmos';

const router = Router();

// Get ratings for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { ratings } = getContainers();
    
    const { resources } = await ratings.items
      .query({
        query: 'SELECT * FROM c WHERE c.eventId = @eventId',
        parameters: [{ name: '@eventId', value: eventId }],
      })
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Error fetching event ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get average rating for an event (admin only)
router.get('/event/:eventId/average', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, groupId } = req.query;
    const { ratings, groups } = getContainers();

    // Check if user is admin of the group
    if (groupId && userId) {
      const { resource: group } = await groups.item(groupId as string, groupId as string).read();
      
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      const member = group.members.find((m: any) => m.userId === userId);
      
      if (!member || member.role !== 'admin') {
        return res.status(403).json({ error: 'Only group admins can view average ratings' });
      }
    } else {
      return res.status(400).json({ error: 'userId and groupId are required' });
    }

    const { resources } = await ratings.items
      .query({
        query: 'SELECT * FROM c WHERE c.eventId = @eventId',
        parameters: [{ name: '@eventId', value: eventId }],
      })
      .fetchAll();

    if (resources.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    const average = resources.reduce((sum, r) => sum + r.value, 0) / resources.length;
    res.json({ average, count: resources.length });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add or update a rating
router.post('/', async (req, res) => {
  try {
    const { eventId, userId, value } = req.body;
    const { ratings } = getContainers();

    if (value < 1 || value > 5) {
      return res.status(400).json({ error: 'Rating value must be between 1 and 5' });
    }

    // Check if user already rated this event
    const { resources } = await ratings.items
      .query({
        query: 'SELECT * FROM c WHERE c.eventId = @eventId AND c.userId = @userId',
        parameters: [
          { name: '@eventId', value: eventId },
          { name: '@userId', value: userId },
        ],
      })
      .fetchAll();

    if (resources.length > 0) {
      // Update existing rating
      const rating = resources[0];
      rating.value = value;
      rating.updatedAt = new Date().toISOString();

      const { resource } = await ratings.item(rating.id, eventId).replace(rating);
      return res.json(resource);
    }

    // Create new rating
    const newRating = {
      id: `rating_${Date.now()}`,
      eventId,
      userId,
      value,
      createdAt: new Date().toISOString(),
    };

    const { resource } = await ratings.items.create(newRating);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating/updating rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
