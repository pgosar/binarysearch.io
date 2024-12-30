import { Types } from 'mongoose';
import { z } from 'zod';

export const zProfile = z.object({
  userId: z.instanceof(Types.ObjectId),
  solvedProblems: z.array(z.instanceof(Types.ObjectId)),
  attemptedProblems: z.array(z.instanceof(Types.ObjectId)),
});
