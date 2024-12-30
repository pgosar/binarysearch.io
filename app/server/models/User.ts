import { Types } from 'mongoose';
import { z } from 'zod';

// Set primary keys on the userId, username & email since we want these to be unique.
export const zUser = z.object({
  userId: z.string().unique(),
  username: z.string().unique(),
  email: z.string().email().unique(),
  role: z.string(),
  profile: z.instanceof(Types.ObjectId),
  experience: z.number().default(0),
  currentRoomCode: z.string().nullable().default(null),
});
