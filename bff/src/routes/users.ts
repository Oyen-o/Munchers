import { Router } from 'express';
import { getContainers } from '../db/cosmos';

const router = Router();

// Get user by phone number
router.get('/phone/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { users } = getContainers();
    
    const { resources } = await users.items
      .query({
        query: 'SELECT * FROM c WHERE c.phoneNumber = @phoneNumber',
        parameters: [{ name: '@phoneNumber', value: phoneNumber }],
      })
      .fetchAll();

    if (resources.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(resources[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or login user
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, displayName } = req.body;
    const { users } = getContainers();

    // Check if user exists
    const { resources } = await users.items
      .query({
        query: 'SELECT * FROM c WHERE c.phoneNumber = @phoneNumber',
        parameters: [{ name: '@phoneNumber', value: phoneNumber }],
      })
      .fetchAll();

    if (resources.length > 0) {
      return res.json(resources[0]);
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      phoneNumber,
      displayName: displayName || phoneNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await users.items.create(newUser);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { users } = getContainers();
    
    const { resource } = await users.item(id, id).read();
    
    if (!resource) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
