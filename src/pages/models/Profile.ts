import { Schema, Types } from 'mongoose';
import { z } from 'zod';


// Zod for input validation
export const zProfileData = z.object({
  userId: z.instanceof(Types.ObjectId),
  solvedProblems: z.array(z.instanceof(Types.ObjectId)),
  attemptedProblems: z.array(z.instanceof(Types.ObjectId)),
});


// Mongoose for schema
export const ProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  solvedProblems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
  attemptedProblems: [{ type: Schema.Types.ObjectId, ref: 'Problem' }],
});
