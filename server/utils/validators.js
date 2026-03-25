const ApiError = require('./ApiError');

const ensureNumber = (value, fieldName) => {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    throw new ApiError(400, `${fieldName} must be a positive integer`);
  }
  return num;
};

const ensureRequired = (payload, fields) => {
  const missing = fields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === '');
  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
  }
};

module.exports = {
  ensureNumber,
  ensureRequired,
};
