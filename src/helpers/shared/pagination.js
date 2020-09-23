export const defaultSettings = {
  limit: 50,
  offset: 0,
  count: 0
};

export const getCurrentPage = (limit = 1, offset = 0) => Math.floor(offset / limit) + 1;

export const getNewPage = (page = 1, limit) => (page - 1) * limit;

export const adjustedOffset = (pagination = { ...defaultSettings }, itemsRemoved = 0) =>
  (pagination.offset !== 0 && pagination.count - itemsRemoved <= pagination.offset ? pagination.offset - pagination.limit : pagination.offset);

