import type { Room } from '../server/models/Room';

export function createRoomInDb(roomData: Room): Promise<Room> {
  console.log(roomData);

  // Simulate the asynchronous operation of creating a room in the database
  return Promise.resolve(roomData); // For now, just return the room data back as a simulation
}

export function getRoomFromDb(roomId: string): Promise<null> {
  console.log(roomId);
  return Promise.resolve(null); // Simulate async operation, return null
}

export function updateRoomInDb(roomId: string, updatedData: { name: string; description: string }): Promise<null> {
  console.log(roomId, updatedData);
  return Promise.resolve(null); // Simulate async operation, return null
}
