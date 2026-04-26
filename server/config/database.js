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
