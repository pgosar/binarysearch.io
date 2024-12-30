import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { createUserInDb } from '../../../services/userService';
import { authenticateJWT } from '../../../utils/auth';
import { UserSchema } from '../../models/User';

// Handler for POST request to create a new user
async function createUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate the request body with the UserSchema
    const { userId, username, email, role, profile, experience, currentRoomCode } = UserSchema.pick({
      userId: true,
      username: true,
      email: true,
      role: true,
      profile: true,
      experience: true,
      currentRoomCode: true,
    }).parse(req.body);

    const newUser = await createUserInDb({ userId, username, email, role, profile, experience, currentRoomCode });

    if (!newUser) {
      return res.status(400).json({ message: 'User creation failed' });
    }

    res.status(201).json({ message: 'User created successfully', data: newUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }

    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Main handler to dispatch to the correct function based on HTTP method
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await authenticateJWT(req, res);

    switch (req.method) {
      case 'POST':
        return await createUser(req, res);

      default:
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
