import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/index.js';

let io;

export function getIO() {
  if (!io) throw new Error('Socket.io has not been initialized');
  return io;
}

export function initSockets(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      socket.user = null; // guests can still join public post rooms
      return next();
    }
    try {
      const payload = verifyAccessToken(token);
      const user = await User.findById(payload.sub).select('name avatar role');
      if (!user) return next(new Error('User no longer exists'));
      socket.user = user;
      next();
    } catch {
      next(new Error('Invalid access token'));
    }
  });

  io.on('connection', (socket) => {
    if (socket.user) socket.join(`user:${socket.user._id}`);

    socket.on('post:join', (postId) => {
      if (typeof postId === 'string' && postId.length === 24) {
        socket.join(`post:${postId}`);
      }
    });

    socket.on('post:leave', (postId) => {
      socket.leave(`post:${postId}`);
    });
  });

  return io;
}