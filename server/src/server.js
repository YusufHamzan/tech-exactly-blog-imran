import http from 'node:http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initSockets } from './sockets/index.js';

async function start() {
  try {
    await connectDB();
    const httpServer = http.createServer(app);
    initSockets(httpServer);
    httpServer.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();