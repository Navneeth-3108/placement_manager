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
    database: sequelize ? 'connected' : 'disconnected',
  });
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);

const connectDatabase = async () => {
  await sequelize.authenticate();
};

const startServer = async () => {
  try {
    await connectDatabase();

    if (String(process.env.DB_SYNC).toLowerCase() === 'true') {
      await sequelize.sync();
    }

    app.listen(PORT, () => {
      // Keeping a startup log is useful in local/dev environments.
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
