const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const dns = require('dns');

dotenv.config();

// Some networks block Neon hostname lookup on local DNS.
// Force reliable public resolvers for Node runtime DNS queries.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const originalLookup = dns.lookup.bind(dns);

// Force Neon host resolution through public DNS when local resolver blocks it.
dns.lookup = (hostname, options, callback) => {
  let normalizedOptions = options;
  let normalizedCallback = callback;

  if (typeof normalizedOptions === 'function') {
    normalizedCallback = normalizedOptions;
    normalizedOptions = {};
  }

  if (typeof normalizedOptions === 'number') {
    normalizedOptions = { family: normalizedOptions };
  }

  const opts = normalizedOptions || {};
  const wantsAll = Boolean(opts.all);
  const family = opts.family || 0;
  const isNeonHost = typeof hostname === 'string' && hostname.includes('.neon.tech');

  if (!isNeonHost) {
    return originalLookup(hostname, options, callback);
  }

  return dns.resolve4(hostname, (resolveErr, addresses) => {
    if (resolveErr || !addresses || addresses.length === 0) {
      return originalLookup(hostname, options, callback);
    }

    if (wantsAll) {
      const all = addresses.map((address) => ({ address, family: 4 }));
      return normalizedCallback(null, all);
    }

    if (family === 6) {
      return originalLookup(hostname, options, callback);
    }

    return normalizedCallback(null, addresses[0], 4);
  });
};

const commonOptions = {
  logging: String(process.env.DB_LOGGING).toLowerCase() === 'true' ? console.log : false,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
};

const databaseUrl = process.env.DATABASE_URL;
const configuredDialect = process.env.DB_DIALECT;
const resolvedDialect = configuredDialect || (databaseUrl ? 'postgres' : 'mysql');
const useSsl = String(process.env.DB_SSL).toLowerCase() === 'true';

const sequelizeConfig = {
  ...commonOptions,
  dialect: resolvedDialect,
};

if (resolvedDialect === 'postgres') {
  sequelizeConfig.hooks = {
    beforeConnect: (config) => {
      // Prefer IPv4 to avoid local DNS/IPv6 resolution issues in some networks.
      config.family = 4;
    },
  };
}

if (useSsl) {
  sequelizeConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, sequelizeConfig)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        ...sequelizeConfig,
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || (resolvedDialect === 'postgres' ? 5432 : 3306)),
      }
    );

module.exports = sequelize;
