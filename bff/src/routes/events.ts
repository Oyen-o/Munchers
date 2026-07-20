import { Router } from 'express';
import { getContainers } from '../db/cosmos';

const router = Router();

// Get all events for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { stage } = req.query;
    const { events } = getContainers();
    
    let query = 'SELECT * FROM c WHERE c.ownerId = @userId AND c.ownerType = "user"';
    const parameters: any[] = [{ name: '@userId', value: userId }];

    if (stage) {
      query += ' AND c.stage = @stage';
      parameters.push({ name: '@stage', value: stage });
    }

    const { resources } = await events.items
      .query({ query, parameters })
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all events for a group
router.get('/group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { stage } = req.query;
    const { events } = getContainers();
    
    let query = 'SELECT * FROM c WHERE c.groupId = @groupId AND c.ownerType = "group"';
    const parameters: any[] = [{ name: '@groupId', value: groupId }];

    if (stage) {
      query += ' AND c.stage = @stage';
      parameters.push({ name: '@stage', value: stage });
    }

    const { resources } = await events.items
      .query({ query, parameters })
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Error fetching group events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create an event
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      stage = 'idea',
      ownerId,
      ownerType,
      groupId,
      hostId,
      plannedDate,
      location,
    } = req.body;
    const { events } = getContainers();

    const newEvent = {
      id: `event_${Date.now()}`,
      title,
      description: description || '',
      stage,
      ownerId,
      ownerType,
      groupId: groupId || null,
      hostId: hostId || null,
      plannedDate: plannedDate || null,
      location: location || null,
      comments: [],
      ratings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await events.items.create(newEvent);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update event stage
router.patch('/:id/stage', async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, hostId, plannedDate, location } = req.body;
    const { events } = getContainers();

    const { resources } = await events.items
      .query({
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [{ name: '@id', value: id }],
      })
      .fetchAll();

    if (resources.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = resources[0];
    const ownerId = event.ownerId;

    event.stage = stage;
    event.updatedAt = new Date().toISOString();

    if (stage === 'picked' && hostId) {
      event.hostId = hostId;
    }

    if (stage === 'planned') {
      if (plannedDate) event.plannedDate = plannedDate;
      if (location) event.location = location;
    }

    const { resource } = await events.item(id, ownerId).replace(event);
    res.json(resource);
  } catch (error) {
    console.error('Error updating event stage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Push event to group
router.post('/:id/push-to-group', async (req, res) => {
  try {
    const { id } = req.params;
    const { groupId } = req.body;
    const { events } = getContainers();

    const { resources } = await events.items
      .query({
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [{ name: '@id', value: id }],
      })
      .fetchAll();

    if (resources.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = resources[0];
    const oldOwnerId = event.ownerId;

    // Delete from old partition
    await events.item(id, oldOwnerId).delete();

    // Update event
    event.groupId = groupId;
    event.ownerType = 'group';
    event.ownerId = groupId;
    event.updatedAt = new Date().toISOString();

    // Create in new partition
    const { resource } = await events.items.create(event);
    res.json(resource);
  } catch (error) {
    console.error('Error pushing event to group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
