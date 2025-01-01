import { Schema } from 'mongoose';

// // Define the schema using zod-mongoose and extendZod
// export const zParticipant = z.object({
//   userId: z.string(),
//   socket: z.string(), // socket ID
//   score: z.number(),
//   currentlyRunning: z.boolean(),

// });

export const ParticipantSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  socketId: { type: String, required: true, unique: true },
  score: { type: Number, required: true },
  currentlyRunning: { type: Boolean, required: true },
  roomId: { type: String, required: false },
});
