import { z } from 'zod';
import { Types } from 'mongoose';

export const ProblemSchema = z.object({
    problemId: z.number(),
    name: z.string(),
    description: z.string(), // HTML as a string
    difficultyTag: z.string(),
    publicTestCases: z.array(z.instanceof(Types.ObjectId)),
    privateTestCases: z.array(z.instanceof(Types.ObjectId)),
});

export type IProblem = z.infer<typeof ProblemSchema>;
