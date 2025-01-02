// lib/dbConnect.tsx

import dotenv from 'dotenv';
import type _mongoose from 'mongoose';
import type { InferSchemaType } from 'mongoose';
import type mongoose from 'mongoose';
import { connect } from 'mongoose';

import { ParticipantSchema } from './models/Participant';
import { ProblemSchema } from './models/Problem';
import { ProfileSchema } from './models/Profile';
import { RoomSchema } from './models/Room';
import { UserSchema } from './models/User';

dotenv.config({ path: '.env.local' });

declare global {
  var mongoose: {
    promise: ReturnType<typeof connect> | null;
    conn: typeof _mongoose | null;
  };

  var database: {
    USERS: mongoose.Model<InferSchemaType<typeof UserSchema>>;
    PROBLEMS: mongoose.Model<InferSchemaType<typeof ProblemSchema>>;
    ROOMS: mongoose.Model<InferSchemaType<typeof RoomSchema>>;
    PROFILE: mongoose.Model<InferSchemaType<typeof ProfileSchema>>;
    PARTICIPANTS: mongoose.Model<InferSchemaType<typeof ParticipantSchema>>;
  };

  var db_init: boolean;
}

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  global.mongoose = { conn: null, promise: null };
  cached = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = connect(MONGODB_URI!, opts).then((mongoose) => {
      if (global.db_init !== true) {
        global.database = {
          PROBLEMS: mongoose.model('Problem', ProblemSchema),
          USERS: mongoose.model('User', UserSchema),
          ROOMS: mongoose.model('Room', RoomSchema),
          PROFILE: mongoose.model('Profile', ProfileSchema),
          PARTICIPANTS: mongoose.model('Participant', ParticipantSchema),
        };
        global.db_init = true;
      }
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function connectCallback(userId: string, socketId: string) {
  await global.database.PARTICIPANTS.findOneAndUpdate(
    { userId },
    { userId, socketId, roomId: null, score: 0 },
    { upsert: true },
  );
}

export async function joinCallback(userId: string, roomId: string) {
  const userPromise = global.database.PARTICIPANTS.findOneAndUpdate({ userId }, { roomId });
  const roomPromise = global.database.ROOMS.findOneAndUpdate(
    { roomId },
    { $push: { $participants: userId } },
    { upsert: true },
  );
  await Promise.allSettled([userPromise, roomPromise]);
}

export async function leaveCallback(userId: string) {
  const userPromise = global.database.PARTICIPANTS.findOneAndUpdate({ userId }, { roomId: null });

  const roomData = await global.database.ROOMS.findOne({ participants: userId });

  if (!roomData) {
    await userPromise;
    return;
  }

  let participants = roomData.participants ?? [];
  participants = participants.filter((x) => x != userId);

  let roomPromise;
  if (participants.length == 0) {
    roomPromise = global.database.ROOMS.findOneAndDelete({ roomId: roomData.roomId });
  } else {
    roomPromise = global.database.ROOMS.findOneAndUpdate(
      { roomId: roomData.roomId },
      { participants, leader: participants[0] },
    );
  }

  await Promise.allSettled([userPromise, roomPromise]);
}

export async function disconnectCallback(userId: string) {
  await leaveCallback(userId);
  await global.database.PARTICIPANTS.findOneAndDelete({ userId });
}
