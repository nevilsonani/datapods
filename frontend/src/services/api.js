import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  getNonce: (walletAddress) => api.get(`/auth/nonce/${walletAddress}`),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Vaults API
export const vaultsAPI = {
  getVaults: () => api.get('/vaults'),
  getVault: (id) => api.get(`/vaults/${id}`),
  createVault: (data) => api.post('/vaults', data),
  updateVault: (id, data) => api.put(`/vaults/${id}`, data),
  deleteVault: (id) => api.delete(`/vaults/${id}`),
  grantAccess: (id, data) => api.post(`/vaults/${id}/access`, data),
  revokeAccess: (id, userId) => api.delete(`/vaults/${id}/access/${userId}`),
  uploadFile: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/vaults/${id}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
