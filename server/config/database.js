const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: String(process.env.DB_LOGGING).toLowerCase() === 'true' ? console.log : false,
    define: {
      freezeTableName: true,
      timestamps: false,
    },
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  }
);

module.exports = sequelize;
