import { z } from 'zod';

export const zRoom = z.object({
  roomId: z.string(),
  socketId: z.number(),
  participants: z.array(z.string()), // Array of userIds
  code: z.string(),
  tags: z.array(z.string()),
  leader: z.string(), // userId
});
