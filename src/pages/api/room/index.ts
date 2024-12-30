import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { createRoomInDb } from '../../../services/roomService'; // Assume this is a function that creates a room in the database
import { authenticateJWT } from '../../../utils/auth';
import { RoomSchema } from '../../models/Room';

// Handler for creating a room
async function createRoom(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate the request body using the RoomSchema (for any existing fields)
    const roomData = RoomSchema.parse(req.body); // Validate using the existing schema

    const newRoom = await createRoomInDb(roomData);

    res.status(201).json({ message: 'Room created successfully', data: newRoom });
  } catch (err) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }

    console.error('Error creating room:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await authenticateJWT(req, res);

    switch (req.method) {
      case 'POST':
        return await createRoom(req, res);

      default:
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
