import { Router } from 'express';
import { getContainers } from '../db/cosmos';

const router = Router();

// Get comments for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { comments } = getContainers();
    
    const { resources } = await comments.items
      .query({
        query: 'SELECT * FROM c WHERE c.eventId = @eventId ORDER BY c.createdAt DESC',
        parameters: [{ name: '@eventId', value: eventId }],
      })
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Error fetching event comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comments for a group
router.get('/group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { comments } = getContainers();
    
    const { resources } = await comments.items
      .query({
        query: 'SELECT * FROM c WHERE c.groupId = @groupId ORDER BY c.createdAt DESC',
        parameters: [{ name: '@groupId', value: groupId }],
      })
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Error fetching group comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a comment
router.post('/', async (req, res) => {
  try {
    const { eventId, groupId, userId, content } = req.body;
    const { comments } = getContainers();

    const newComment = {
      id: `comment_${Date.now()}`,
      eventId: eventId || null,
      groupId: groupId || null,
      userId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await comments.items.create(newComment);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
