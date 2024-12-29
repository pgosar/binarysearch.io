import { z } from 'zod';
import { Types, model } from 'mongoose';
import { extendZod, zodSchema } from '@zodyac/zod-mongoose';

extendZod(z);

//Testcase id should be unique. 
export const zTestCase = z.object({
    testcaseId: z.number().unique(),
    problemId: z.instanceof(Types.ObjectId),
    input: z.object({}), 
    output: z.object({}), 
});

export const testSchema = zodSchema(zTestCase); 
export const userModel = model("Test", testSchema);

