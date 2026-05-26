import axios from 'axios';

// Use relative path '/api' in production so it points to Render itself
// Use ngrok for local development fallback if needed
export const BACKEND_URL = window.location.hostname.includes('ngrok') ? 'https://trodden-scoreless-schnapps.ngrok-free.dev' : '';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: { 
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('pos_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pos_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
