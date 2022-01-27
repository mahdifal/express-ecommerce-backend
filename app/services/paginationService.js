module.exports = function ({ totalPages, page, apiName, limit }) {
  return {
    totalPages,
    page: parseInt(page),
    next: hasNextPage(page, totalPages)
      ? `${process.env.APP_URL}/api/v1/${apiName}?page=${
          parseInt(page) + 1
        }&limit=${limit}`
      : null,
    prev: hasPrevPage(page)
      ? `${process.env.APP_URL}/api/v1/${apiName}?page=${
          parseInt(page) - 1
        }&limit=${limit}`
      : null,
  };
};

const hasNextPage = (page, totalPage) => page < totalPage;
const hasPrevPage = (page) => page > 1;
