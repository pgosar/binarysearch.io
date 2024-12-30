import type { IUser } from '../server/models/User';

export function deleteUserFromDb(userId: string): Promise<null> {
  console.log(userId);
  return Promise.resolve(null); // Simulate async operation, return null
}

export function updateUserInDb(userId: string, updatedData: IUser): Promise<null> {
  console.log(userId, updatedData);
  return Promise.resolve(null); // Simulate async operation, return null
}
export function getUserFromDb(userId: string): Promise<null> {
  console.log(userId);
  return Promise.resolve(null); // Simulate async operation, return null
}

export function getUserProfile(userId: string): Promise<null> {
  console.log(userId);
  return Promise.resolve(null); // Simulate async operation, return null
}

export function createUserInDb(userData: IUser): Promise<null> {
  console.log(userData); // Log the validated user data
  return Promise.resolve(null); // Simulate async operation, return null
}
