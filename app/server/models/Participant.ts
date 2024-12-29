import { z } from 'zod';

export const ParticipantSchema = z.object({
    userId: z.string(),
    socket: z.string(), // socket ID
    score: z.number(),
    currentlyRunning: z.boolean(),
});

export type Participant = z.infer<typeof ParticipantSchema>;
