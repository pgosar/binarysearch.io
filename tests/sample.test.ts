/**
 * @jest-environment node
 */

import mongoose from 'mongoose';
import { UserSchema } from '../app/server/models/User';
import { ProfileSchema } from '../app/server/models/Profile';
import { ParticipantSchema } from '../app/server/models/Participant';

const dummyObjectId = new mongoose.Types.ObjectId();

describe('UserSchema', () => {
  it('should parse valid user data successfully', () => {
    const validUser = {
      userId: 'user123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin',
      profile: dummyObjectId,
      experience: 50,
      currentRoomCode: null,
    };

    const result = UserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validUser);
    }
  });

  it('should fail when email is invalid', () => {
    const invalidUser = {
      userId: 'user123',
      username: 'testuser',
      email: 'invalid-email',
      role: 'admin',
      profile: dummyObjectId,
      experience: 50,
      currentRoomCode: null,
    };

    const result = UserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Invalid email');
    }
  });
});

describe('ProfileSchema', () => {
  it('should parse valid profile data successfully', () => {
    const validProfile = {
      userId: dummyObjectId,
      solvedProblems: [dummyObjectId, new mongoose.Types.ObjectId()],
      attemptedProblems: [new mongoose.Types.ObjectId()],
    };

    const result = ProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validProfile);
    }
  });

  it('should fail if solvedProblems is not an array of ObjectIds', () => {
    const invalidProfile = {
      userId: dummyObjectId,
      solvedProblems: ['notAnObjectId'],
      attemptedProblems: [],
    };

    const result = ProfileSchema.safeParse(invalidProfile);
    expect(result.success).toBe(false);
  });
});

describe('ParticipantSchema', () => {
  it('should parse valid participant data successfully', () => {
    const validParticipant = {
      userId: 'user123',
      socket: 'socket-abc',
      score: 10,
      currentlyRunning: true,
    };

    const result = ParticipantSchema.safeParse(validParticipant);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validParticipant);
    }
  });

  it('should fail if score is not a number', () => {
    const invalidParticipant = {
      userId: 'user123',
      socket: 'socket-abc',
      score: 'not-a-number',
      currentlyRunning: true,
    };

    const result = ParticipantSchema.safeParse(invalidParticipant);
    expect(result.success).toBe(false);
  });

  it('should fail if currentlyRunning is not a boolean', () => {
    const invalidParticipant = {
      userId: 'user123',
      socket: 'socket-abc',
      score: 10,
      currentlyRunning: 'yes',
    };

    const result = ParticipantSchema.safeParse(invalidParticipant);
    expect(result.success).toBe(false);
  });
});
