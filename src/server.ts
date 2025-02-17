import { createServer } from 'node:http';

import next from 'next';
import { Server } from 'socket.io';

import { connectCallback, dbConnect, disconnectCallback, joinCallback, leaveCallback } from './database';

const dev = process.env.ENV !== 'production';
const hostname = 'localhost';
const port = 3001;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

/*
 * user registers/logins -> authenticated -> create new participant
 * user disconnects (leaves webpage) -> delete participant
 */

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on('connection', async (socket) => {
    await dbConnect();
    const socketId = socket.id;

    socket.on('initialConnection', async (token) => {
      await connectCallback(token, socketId);
    });

    socket.on('joinRoom', async (token, roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('userJoined', socket.id);
      await joinCallback(token, roomId);
    });

    socket.on('leaveRoom', async (token, roomId) => {
      socket.leave(roomId);
      io.to(roomId).emit('userLeft', socket.id);
      await leaveCallback(token);
    });

    socket.on('disconnect', async (token) => {
      await disconnectCallback(token);
    });

    socket.on('sendMessage', (token, message, room) => {
      socket.to(room).emit('message', message);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
