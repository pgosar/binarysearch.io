// lib/dbConnect.tsx

import type _mongoose from 'mongoose';
import type { InferSchemaType } from 'mongoose';
import type mongoose from 'mongoose';
import { connect } from 'mongoose';

import { ProblemSchema } from './models/Problem';
import { UserSchema } from './models/User';
import {RoomSchema} from "./models/Room";
import {ProfileSchema} from "./models/Profile";

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
