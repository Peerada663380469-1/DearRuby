import axios from 'axios';

export const BACKEND_URL = 'https://trodden-scoreless-schnapps.ngrok-free.dev';

const api = axios.create({
  // Use the ngrok URL for the deployed Netlify demo to connect back to your local computer
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
