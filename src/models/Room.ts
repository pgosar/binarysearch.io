import { Schema } from 'mongoose';
import { generateRandomString } from 'src/utils/id-generator';
import { v4 } from 'uuid';
import { z } from 'zod';

const ROOM_CODE_LENGTH = 6;

export const zRoomData = z.object({
  tags: z.array(z.string()),
});

export const zRoomId = z.object({
  roomId: z.string(),
});

// Minimum to create a room
export const RoomSchema = new Schema({
  roomId: { type: String, required: false, unique: true, default: () => v4() },
  participants: { type: [String], required: false, default: () => [] },
  code: { type: String, required: false, unique: true, default: () => generateRandomString(ROOM_CODE_LENGTH) },
  tags: { type: String, required: false },
  leader: { type: String, required: true },
});
