import axios, { type AxiosError, type AxiosInstance } from 'axios';
import type { ApiResponse, TokenResponse, LoginRequest } from '../types';

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7101',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Primary source: dedicated 'token' key
    let token = localStorage.getItem('cms-token');

    // Fallback: read from Zustand persisted state
    if (!token) {
      try {
        const raw = localStorage.getItem('cms-auth-storage');
        if (raw) {
          const parsed = JSON.parse(raw);
          token = parsed?.state?.token ?? null;
          if (token) localStorage.setItem('cms-token', token);
        }
      } catch {
        // ignore
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error and success handling
api.interceptors.response.use(
  (response) => {
    // Automatically show success toast for mutation requests
    if (['post', 'put', 'patch', 'delete'].includes(response.config.method?.toLowerCase() || '')) {
      // Don't auto-toast for login calls
      if (!response.config.url?.toLowerCase().includes('/login')) {
        import('@/store/useToastStore').then(({ useToastStore }) => {
          const msg = response.data?.message || 'Operation completed successfully';
          useToastStore.getState().showToast(msg, 'success');
        });
      }
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      import('@/store/useAuthStore').then(({ useAuthStore }) => {
        useAuthStore.getState().logout();
      });
    }

    // Auto-show error toasts globally
    import('@/store/useToastStore').then(({ useToastStore }) => {
      const rd = error.response?.data as any;
      let msg = 'Operation failed';
      
      if (error.response?.status === 500) {
        msg = rd?.message || rd?.data || 'Server error occurred. Please try again later.';
      } else if (error.response?.status === 404) {
        msg = 'Resource not found';
      } else if (error.response?.status === 403) {
        msg = 'Access denied. You do not have permission to perform this action.';
      } else if (error.response?.status === 400) {
        msg = rd?.message || rd?.data || 'Invalid request. Please check your input.';
      } else {
        msg = rd?.message || rd?.data || error.message || 'Operation failed';
      }
      
      useToastStore.getState().showToast(msg, 'error');
    });

    return Promise.reject(error);
  }
);

// Auth Service
export const AuthService = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<TokenResponse>>('/api/Auth/login', data).then(res => res.data.data),
};

export default api;
