import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance với cấu hình chung
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động thêm token vào header
apiClient.interceptors.request.use(
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

// Interceptor để xử lý response lỗi
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  logout: () => {
    return apiClient.post('/auth/logout');
  },

  verifyToken: (token) => {
    return apiClient.get('/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => response.data);
  },

  refreshToken: () => {
    return apiClient.post('/auth/refresh');
  }
};

export const userService = {
  getAllUsers: () => {
    return apiClient.get('/users');
  },

  getUserById: (id) => {
    return apiClient.get(`/users/${id}`);
  },

  createUser: (userData) => {
    return apiClient.post('/users', userData);
  },

  updateUser: (id, userData) => {
    return apiClient.put(`/users/${id}`, userData);
  },

  deleteUser: (id) => {
    return apiClient.delete(`/users/${id}`);
  }
};

export const companyService = {
  getAllCompanies: () => {
    return apiClient.get('/companies');
  },

  getCompanyById: (id) => {
    return apiClient.get(`/companies/${id}`);
  },

  createCompany: (companyData) => {
    return apiClient.post('/companies', companyData);
  },

  updateCompany: (id, companyData) => {
    return apiClient.put(`/companies/${id}`, companyData);
  },

  deleteCompany: (id) => {
    return apiClient.delete(`/companies/${id}`);
  }
};

export default apiClient;