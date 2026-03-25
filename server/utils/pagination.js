const getPagination = (page = 1, limit = 10) => {
  const safePage = Number(page) > 0 ? Number(page) : 1;
  const safeLimit = Number(limit) > 0 ? Number(limit) : 10;
  const offset = (safePage - 1) * safeLimit;
  return { page: safePage, limit: safeLimit, offset };
};

const getPagingData = (result, page, limit) => {
  const { count: totalItems, rows: data } = result;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    data,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      pageSize: limit,
    },
  };
};

module.exports = {
  getPagination,
  getPagingData,
};
