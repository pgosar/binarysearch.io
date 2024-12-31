import { Schema } from 'mongoose';
import { z } from 'zod';

export const zRoomData = z.object({
  socketId: z.number(),
  participants: z.array(z.string()), // Array of userIds
  code: z.string(),
  tags: z.array(z.string()),
  leader: z.string(), // userId
});

export const zRoomId = z.object({
  userId: z.string(),
});

export const RoomSchema = new Schema({
  roomId: {
    type: Number,
    required: true,
    unique: true,
  },
  socketId: {
    type: Number,
    required: true,
    unique: true,
  },
  participants: { type: [String], required: true },
  code: { type: String, required: false },
  tags: { type: String, required: false },
  leader: { type: String, required: true },
});
