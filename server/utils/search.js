const { fn, col, where } = require('sequelize');

const ciLike = (field, value) => {
  if (!value) return null;
  return where(fn('LOWER', col(field)), 'LIKE', `%${String(value).toLowerCase()}%`);
};

module.exports = {
  ciLike,
};
