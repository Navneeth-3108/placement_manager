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
let isDbConnected = false;

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
    database: isDbConnected ? 'connected' : 'disconnected',
  });
});

app.use('/api', (req, res, next) => {
  if (!isDbConnected && req.path !== '/health') {
    return res.status(503).json({
      success: false,
      message: 'API is unavailable because database connection is not established.',
    });
  }

  return next();
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    isDbConnected = true;
  } catch (error) {
    isDbConnected = false;
    console.error('Database connection failed:', error.message);
  }
};

const startServer = async () => {
  try {
    await connectDatabase();

    if (isDbConnected && String(process.env.DB_SYNC).toLowerCase() === 'true') {
      await sequelize.sync();
    }

    app.listen(PORT, () => {
      // Keeping a startup log is useful in local/dev environments.
      console.log(`Server running on port ${PORT}`);
    });

    // Retry in background so the API recovers automatically once DB is up.
    setInterval(connectDatabase, 15000);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
