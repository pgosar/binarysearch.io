import { z } from 'zod';
import { extendZod } from '@zodyac/zod-mongoose';



// Define the schema using zod-mongoose and extendZod
export const ParticipantSchema = extendZod(z.object({
    userId: z.string(),
    socket: z.string(), // socket ID
    score: z.number(),
    currentlyRunning: z.boolean(),
}));

export type Participant = z.infer<typeof ParticipantSchema>;
