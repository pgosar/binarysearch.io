import { z } from 'zod';
import { extendZod, zodSchema } from '@zodyac/zod-mongoose';
import {model, Types} from "mongoose";

extendZod(z);

export const zProfile = z.object({
    userId: z.instanceof(Types.ObjectId),
    solvedProblems: z.array(z.instanceof(Types.ObjectId)),
    attemptedProblems: z.array(z.instanceof(Types.ObjectId)),
});

export const profileSchema = zodSchema(zProfile);
export const profileModel = model("Profile", profileSchema);
