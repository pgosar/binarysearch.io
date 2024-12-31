import { Schema, Types } from 'mongoose';
import { z } from 'zod';

export const zProblemData = z.object({
  name: z.string(),
  description: z.string(), // HTML as a string
  difficultyTag: z.string(),
  publicTestCases: z.array(z.instanceof(Types.ObjectId)),
  privateTestCases: z.array(z.instanceof(Types.ObjectId)),
});

export const zProblemId = z.object({
  userId: z.coerce.number().min(0),
});

export const ProblemSchema = new Schema({
  problemId: {
    type: Number,
    required: false,
    unique: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true }, // HTML as a string
  difficultyTag: { type: String, required: true },
  publicTestCases: [{ type: Schema.Types.ObjectId, ref: 'Testcase' }],
  privateTestCases: [{ type: Schema.Types.ObjectId, ref: 'Testcase' }],
});

// Settin problem id in monotonic increasing order
ProblemSchema.pre('save', async function () {
  if (this.problemId === undefined) {
    const ct = await global.database.PROBLEMS.countDocuments();
    this.problemId = ct + 1;
  }
});
