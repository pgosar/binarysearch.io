import { z } from 'zod';
import { Types } from 'mongoose';

export const TestcaseSchema = z.object({
    testcaseId: z.number(),
    problemId: z.instanceof(Types.ObjectId),
    input: z.object({}), // Object, can be more specific depending on your structure
    output: z.object({}), // Object, can be more specific depending on your structure
});

export type ITestcase = z.infer<typeof TestcaseSchema>;
