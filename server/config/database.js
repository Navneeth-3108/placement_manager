const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const commonOptions = {
  logging: String(process.env.DB_LOGGING).toLowerCase() === 'true' ? console.log : false,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
};

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  ...commonOptions,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  hooks: {
    beforeConnect: (config) => {
      // If a system prefers IPv4, this helps avoid IPv6-only DNS answers causing ENOTFOUND/timeout.
      config.family = 4;
    },
  },
});

module.exports = sequelize;
