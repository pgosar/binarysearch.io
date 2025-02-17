import { z } from 'zod';
import { Types } from 'mongoose';

export const ProfileSchema = z.object({
    userId: z.instanceof(Types.ObjectId),
    solvedProblems: z.array(z.instanceof(Types.ObjectId)),
    attemptedProblems: z.array(z.instanceof(Types.ObjectId)),
});

export type IProfile = z.infer<typeof ProfileSchema>;
