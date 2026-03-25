import api from './api';

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });
  return searchParams.toString() ? `?${searchParams.toString()}` : '';
};

const getList = async (path, params) => {
  const { data } = await api.get(`${path}${buildQuery(params)}`);
  return data;
};

const postItem = async (path, payload) => {
  const { data } = await api.post(path, payload);
  return data;
};

const patchItem = async (path, payload) => {
  const { data } = await api.patch(path, payload);
  return data;
};

const deleteItem = async (path) => {
  const { data } = await api.delete(path);
  return data;
};

export { getList, postItem, patchItem, deleteItem };
