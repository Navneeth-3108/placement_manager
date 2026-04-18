import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error('VITE_API_BASE_URL is required in client environment configuration.');
}

const api = axios.create({
  baseURL,
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
      (error.request ? 'Cannot reach the API server. Check API URL and server status.' : error.message) ||
      'Unexpected error';
    return Promise.reject(new Error(message));
  }
);

export default api;
