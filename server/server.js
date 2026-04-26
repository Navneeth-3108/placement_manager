const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const sequelize = require('./config/database');
require('./models');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
let databaseConnected = false;
let reconnectTimer = null;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const configuredOrigin = process.env.CORS_ORIGIN;
      const isLocalDevOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

      if ((configuredOrigin && origin === configuredOrigin) || isLocalDevOrigin) {
        return callback(null, true);
      }

      return callback(new Error('CORS policy does not allow this origin'));
    },
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Placement Manager API is running',
    database: databaseConnected ? 'connected' : 'disconnected',
  });
});

app.use('/api', (req, res, next) => {
  if (req.path === '/health') {
    return next();
  }

  if (!databaseConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database is currently unavailable. Please try again shortly.',
    });
  }

  return next();
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);
const DB_RETRY_INTERVAL_MS = 15000;
const shouldAutoSyncSchema =
  String(process.env.DB_SYNC).toLowerCase() === 'true' || process.env.NODE_ENV !== 'production';

const connectDatabase = async () => {
  await sequelize.authenticate();

  if (shouldAutoSyncSchema) {
    // Ensure required tables exist in development so API routes don't fail on first run.
    await sequelize.sync();
  }

  databaseConnected = true;

  if (reconnectTimer) {
    clearInterval(reconnectTimer);
    reconnectTimer = null;
  }
};

const startServer = async () => {
  app.listen(PORT, () => {
    // Keeping a startup log is useful in local/dev environments.
    console.log(`Server running on port ${PORT}`);
  });

  try {
    await connectDatabase();
    console.log('Database connection established.');
  } catch (error) {
    databaseConnected = false;
    console.error('Database connection failed. Running in degraded mode:', error.message);

    if (!reconnectTimer) {
      reconnectTimer = setInterval(async () => {
        try {
          await connectDatabase();
          console.log('Database reconnection successful.');
        } catch (reconnectError) {
          databaseConnected = false;
          console.error('Database reconnection failed:', reconnectError.message);
        }
      }, DB_RETRY_INTERVAL_MS);
    }
  }
};

startServer();
