import { z } from 'zod';

export const zRoom = z.object({
  roomId: z.string().unique(),
  socketId: z.number().unique(),
  participants: z.array(z.string().unique()), // Array of userIds
  code: z.string(),
  tags: z.array(z.string()),
  leader: z.string(), // userId
});
