import { z } from 'zod';
import { extendZod, zodSchema } from '@zodyac/zod-mongoose';
import {model} from "mongoose";

extendZod(z);

// Define the schema using zod-mongoose and extendZod
export const zParticipant = z.object({
    userId: z.string().unique(),
    socket: z.string().unique(), // socket ID
    score: z.number(),
    currentlyRunning: z.boolean(),
});

export const participantSchema = zodSchema(zParticipant);
export const participantModel = model("Participant", participantSchema);

