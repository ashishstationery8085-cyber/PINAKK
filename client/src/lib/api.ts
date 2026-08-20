import axios from 'axios';

const normalizeApiBaseUrl = (value: string) => {
  const trimmed = (value || 'http://localhost:4001/api').trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

console.log('API baseURL:', api.defaults.baseURL);

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error?.response?.data?.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    console.error('Full error:', error);
    return Promise.reject(error);
  }
);

export const fetcher = (url: string) => api.get(url).then((res) => res.data);
export default api;
