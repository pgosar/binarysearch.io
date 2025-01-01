import { Schema } from 'mongoose';

export const ParticipantSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  socketId: { type: String, required: true, unique: true },
  score: { type: Number, required: true },
  currentlyRunning: { type: Boolean, required: true },
  roomId: { type: String, required: false },
});
