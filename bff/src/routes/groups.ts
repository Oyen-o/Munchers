import { Router } from 'express';
import { getContainers } from '../db/cosmos';

const router = Router();

// Get all groups for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { groups } = getContainers();
    
    const { resources } = await groups.items
      .query({
        query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(c.members, {"userId": @userId}, true)',
        parameters: [{ name: '@userId', value: userId }],
      })
      .fetchAll();

    res.json(resources);
  } catch (error) {
    console.error('Error fetching user groups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get group by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { groups } = getContainers();
    
    const { resource } = await groups.item(id, id).read();
    
    if (!resource) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a group
router.post('/', async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;
    const { groups } = getContainers();

    const newGroup = {
      id: `group_${Date.now()}`,
      name,
      description: description || '',
      createdBy,
      members: [
        {
          userId: createdBy,
          role: 'admin',
          joinedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await groups.items.create(newGroup);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add member to group
router.post('/:id/members', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role = 'member' } = req.body;
    const { groups } = getContainers();

    const { resource: group } = await groups.item(id, id).read();
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is already a member
    if (group.members.some((m: any) => m.userId === userId)) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    group.members.push({
      userId,
      role,
      joinedAt: new Date().toISOString(),
    });
    group.updatedAt = new Date().toISOString();

    const { resource: updated } = await groups.item(id, id).replace(group);
    res.json(updated);
  } catch (error) {
    console.error('Error adding member to group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
