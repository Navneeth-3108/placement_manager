import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const setApiAuthContext = ({ userId, emailAddress, role } = {}) => {
  if (userId) {
    api.defaults.headers.common['x-user-id'] = userId;
  } else {
    delete api.defaults.headers.common['x-user-id'];
  }

  if (emailAddress) {
    api.defaults.headers.common['x-user-email'] = String(emailAddress).toLowerCase();
  } else {
    delete api.defaults.headers.common['x-user-email'];
  }

  if (role) {
    api.defaults.headers.common['x-user-role'] = String(role).toLowerCase();
  } else {
    delete api.defaults.headers.common['x-user-role'];
  }
};

api.interceptors.request.use((config) => {
  const userId = import.meta.env.VITE_RBAC_USER_ID;
  const userEmail = import.meta.env.VITE_RBAC_USER_EMAIL;
  const userRole = import.meta.env.VITE_RBAC_USER_ROLE;

  if (userId) {
    config.headers['x-user-id'] = userId;
  }

  if (userEmail) {
    config.headers['x-user-email'] = String(userEmail).toLowerCase();
  }

  if (userRole) {
    config.headers['x-user-role'] = String(userRole).toLowerCase();
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.request ? 'Cannot reach the API server. Check API URL and server status.' : error.message) ||
      'Unexpected error';
    return Promise.reject(new Error(message));
  }
);

export default api;
