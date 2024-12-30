// lib/dbConnect.tsx

import { extendZod, zodSchema } from '@zodyac/zod-mongoose';
import type _mongoose from 'mongoose';
import { connect } from 'mongoose';
import { model } from 'mongoose';
import { z } from 'zod';

import { zProblem } from './models/Problem';
import { zProfile } from './models/Profile';
import { zTestCase } from './models/Testcase';
import { zUser } from './models/User';

extendZod(z);

declare global {
  var mongoose: {
    promise: ReturnType<typeof connect> | null;
    conn: typeof _mongoose | null;
  };
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

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = connect(MONGODB_URI!, opts).then((mongoose) => {
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

function convertZodToMongoose(name: string, schema: z.ZodObject<any, any, any, any, any>) {
  const mongooseSchema = zodSchema(schema);
  return model(name, mongooseSchema);
}

export const MONGO_DATABASE = {
  Problem: convertZodToMongoose('Problem', zProblem),
  Profile: convertZodToMongoose('Profile', zProfile),
  Testcase: convertZodToMongoose('Testcase', zTestCase),
  User: convertZodToMongoose('Testcase', zUser),
};

export default dbConnect;
