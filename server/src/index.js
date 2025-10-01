require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

let server;

const start = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/univlabs';
  try {
    await mongoose.connect(mongoUri); // no deprecated options
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }

  const PORT = process.env.PORT || 4000;
  server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
};

start().catch(err => { console.error('Startup error', err); process.exit(1); });

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`Received ${signal}. Closing server and MongoDB connection...`);
  try {
    if (server) await new Promise(res => server.close(res));
    await mongoose.disconnect();
    console.log('Shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
