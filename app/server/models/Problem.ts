import { Types } from 'mongoose';
import { z } from 'zod';

export const zProblem = z.object({
  problemId: z.number().unique(),
  name: z.string(),
  description: z.string(), // HTML as a string
  difficultyTag: z.string(),
  publicTestCases: z.array(z.instanceof(Types.ObjectId)),
  privateTestCases: z.array(z.instanceof(Types.ObjectId)),
});
