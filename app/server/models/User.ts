import { z } from 'zod';
import { Types } from 'mongoose';

export const UserSchema = z.object({
    userId: z.string(),
    username: z.string(),
    email: z.string().email(),
    role: z.string(),
    profile: z.instanceof(Types.ObjectId),
    experience: z.number().default(0),
    currentRoomCode: z.string().nullable().default(null),
});

export type IUser = z.infer<typeof UserSchema>;
