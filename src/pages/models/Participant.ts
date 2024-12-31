import { z } from 'zod';

// Define the schema using zod-mongoose and extendZod
export const zParticipant = z.object({
  userId: z.string(),
  socket: z.string(), // socket ID
  score: z.number(),
  currentlyRunning: z.boolean(),
});
