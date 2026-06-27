// API Service Layer
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error.response?.data || error);
  }
);

export const authAPI = {
  signin: (accessToken, user) => 
    apiClient.post('/api/auth/signin', { accessToken, user }),
  
  verify: (accessToken, user) => 
    apiClient.post('/api/auth/verify', { accessToken, user }),
  
  signout: () => 
    apiClient.post('/api/auth/signout'),
  
  getMe: () => 
    apiClient.get('/api/auth/me'),
};

export const paymentsAPI = {
  create: (amount, productId, productName, memo) => 
    apiClient.post('/api/payments/create', {
      amount,
      productId,
      productName,
      memo,
    }),
  
  approve: (paymentId) => 
    apiClient.post('/api/payments/approve', { paymentId }),
  
  complete: (paymentId, txid) => 
    apiClient.post('/api/payments/complete', { paymentId, txid }),
  
  getDetails: (paymentId) => 
    apiClient.get(`/api/payments/${paymentId}`),
};

export const vendorsAPI = {
  getDashboard: () => 
    apiClient.get('/api/vendors/dashboard'),
  
  register: (shopName, description, piWalletAddress) => 
    apiClient.post('/api/vendors/register', {
      shopName,
      description,
      piWalletAddress,
    }),
  
  getSales: (vendorId) => 
    apiClient.get(`/api/vendors/${vendorId}/sales`),
};

export default apiClient;
