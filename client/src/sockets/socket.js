import { io } from 'socket.io-client';
import { tokenStore } from '../api/client.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket'],
});

export function connectSocket() {
  socket.auth = { token: tokenStore.get() };
  if (socket.connected) socket.disconnect();
  socket.connect();
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}