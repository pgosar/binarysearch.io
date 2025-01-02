import { Schema, Types } from 'mongoose';
import { v4 } from 'uuid';
import { z } from 'zod';

// Set primary in ukeys on the userId, username & email since we want these to be unique.
export const zUserData = z.object({
  username: z.string(),
  email: z.string().email(),
  role: z.string(),
  profile: z.instanceof(Types.ObjectId),
  experience: z.number().default(0),
  currentRoomCode: z.string().nullable().default(null),
});

export const zUserId = z.object({
  userId: z.string(),
});

export const UserSchema = new Schema({
  userId: { type: String, required: false, unique: true, default: () => v4() },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  experience: { type: Number, default: 0 },
  currentRoomCode: { type: String, default: null, nullable: true },
});
