const { fn, col, where } = require('sequelize');

const ciLike = (field, value) => {
  if (!value) return null;
  return where(fn('LOWER', col(field)), 'LIKE', `%${String(value).toLowerCase()}%`);
};

const toSearchNumber = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized || !/^\d+$/.test(normalized)) {
    return null;
  }
  return Number(normalized);
};

module.exports = {
  ciLike,
  toSearchNumber,
};
