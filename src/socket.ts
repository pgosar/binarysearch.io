import { io } from 'socket.io-client';

export const socket = {
  socket: io(),
  isServer: typeof window !== 'undefined',
};
