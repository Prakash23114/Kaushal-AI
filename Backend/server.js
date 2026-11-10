require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectToDB = require('./src/config/db');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

connectToDB();

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

const gracefulShutdown = () => {
  console.log('Received shutdown signal, closing server gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
