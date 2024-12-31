import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('joinRoom', (room) => {
      socket.join(room);
      socket.to(room).emit('userJoined', socket.id);
      console.log('user joined room: ', room);
    });

    socket.on('leaveRoom', (room) => {
      socket.leave(room);
      io.to(room).emit('userLeft', socket.id);
      console.log('user left room: ', room);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('sendMessage', (message, room) => {
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
