import { z } from 'zod';
import { extendZod, zodSchema } from '@zodyac/zod-mongoose';
import {model, Types} from "mongoose";

extendZod(z);

export const zProblem = z.object({
    problemId: z.number().unique(),
    name: z.string(),
    description: z.string(), // HTML as a string
    difficultyTag: z.string(),
    publicTestCases: z.array(z.instanceof(Types.ObjectId)),
    privateTestCases: z.array(z.instanceof(Types.ObjectId)),
});

export const problemSchema = zodSchema(zProblem);
export const problemModel = model("Profile", problemSchema);
