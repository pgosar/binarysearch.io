import { z } from 'zod';

// Define the schema using zod-mongoose and extendZod
export const zParticipant = z.object({
  userId: z.string().unique(),
  socket: z.string().unique(), // socket ID
  score: z.number(),
  currentlyRunning: z.boolean(),
});
