import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.request
        ? 'Cannot reach the API server. Ensure the server is running on http://localhost:5000.'
        : error.message) ||
      'Unexpected error';
    return Promise.reject(new Error(message));
  }
);

export default api;
