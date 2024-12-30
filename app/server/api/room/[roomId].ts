import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { getRoomFromDb, updateRoomInDb } from '../../../services/roomService'; // Assumes these are in your service layer
import { authenticateJWT } from '../../../utils/auth';
import { RoomSchema } from '../../models/Room';

// Handler for getting room details
async function getRoom(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;

  try {
    RoomSchema.pick({ roomId: true }).parse({ roomId }); // Validate only roomId
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid or missing roomId', errors: error.errors });
    }
  }

  if (!roomId || Array.isArray(roomId)) {
    return res.status(400).json({ message: 'Invalid or missing roomId' });
  }

  try {
    const room = await getRoomFromDb(roomId as string);

    if (!room) {
      return res.status(404).json({ message: `Room with ID ${roomId} not found` });
    }

    res.status(200).json({ message: `Room found`, data: room });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Handler for updating room details
async function patchRoom(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query;

  // Validate roomId using Zod (ensure it's a string and matches the expected roomId type)
  try {
    RoomSchema.pick({ roomId: true }).parse({ roomId }); // Validate only roomId
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid or missing roomId', errors: error.errors });
    }
  }

  if (!roomId || Array.isArray(roomId)) {
    return res.status(400).json({ message: 'Invalid or missing roomId' });
  }

  // Validate the request body using the RoomSchema (for name and description in patch)
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: 'Both name and description are required to update the room' });
  }

  try {
    const updatedRoom = await updateRoomInDb(roomId as string, { name, description });

    if (!updatedRoom) {
      return res.status(404).json({ message: `Room with ID ${roomId} not found` });
    }

    res.status(200).json({ message: `Room updated successfully`, data: updatedRoom });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await authenticateJWT(req, res);

    switch (req.method) {
      case 'GET':
        return await getRoom(req, res);
      case 'PATCH':
        return await patchRoom(req, res);
      default:
        res.setHeader('Allow', ['GET', 'PATCH']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
