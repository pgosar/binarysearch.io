import { Types } from 'mongoose';
import { z } from 'zod';

//Testcase id should be unique.
export const zTestCase = z.object({
  testcaseId: z.number(),
  problemId: z.instanceof(Types.ObjectId),
  input: z.object({}),
  output: z.object({}),
});
