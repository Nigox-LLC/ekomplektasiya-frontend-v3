import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import type { LoginCredentials, AuthResponse } from '../types/auth'; // We need to define these types
import type { EmployeeDetail } from '../types/employee';
import type { PaginatedResponse, Region, District, Department, Position, ProductType, ProductModel, Unit, Size } from '../types/reference';

// Using /api based on the OpenAPI spec which shows /api/users/login/
// If VITE_API_URL is not set, we assume a proxy or direct URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors (e.g., 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/users/login/', credentials);
    return response.data;
  },
};

export const employeeApi = {
  getEmployeeProfile: async (): Promise<EmployeeDetail> => {
    const response = await api.get<EmployeeDetail>('/api/staff/employees/get_current_employee/');
    return response.data;
  }
};

export const directoryApi = {
  // Regions
  getRegions: async (params?: any) => {
    const response = await api.get<PaginatedResponse<Region>>('/api/directory/area/regions/', { params });
    return response.data;
  },
  createRegion: async (data: any) => {
    const response = await api.post<Region>('/api/directory/area/regions/', data);
    return response.data;
  },
  updateRegion: async (id: number, data: any) => {
    const response = await api.patch<Region>(`/api/directory/area/regions/${id}/`, data);
    return response.data;
  },
  deleteRegion: async (id: number) => {
    await api.delete(`/api/directory/area/regions/${id}/`);
  },
  // Districts
  getDistricts: async (params?: any) => {
    const response = await api.get<PaginatedResponse<District>>('/api/directory/area/districts/', { params });
    return response.data;
  },
  createDistrict: async (data: any) => {
    const response = await api.post<District>('/api/directory/area/districts/', data);
    return response.data;
  },
  updateDistrict: async (id: number, data: any) => {
    const response = await api.patch<District>(`/api/directory/area/districts/${id}/`, data);
    return response.data;
  },
  deleteDistrict: async (id: number) => {
    await api.delete(`/api/directory/area/districts/${id}/`);
  },
  // Departments
  getDepartments: async (params?: any) => {
    const response = await api.get<PaginatedResponse<Department>>('/api/directory/organization/department/', { params });
    return response.data;
  },
  // Positions
  getPositions: async (params?: any) => {
    const response = await api.get<PaginatedResponse<Position>>('/api/directory/organization/position/', { params });
    return response.data;
  },
  // Product Types
  getProductTypes: async (params?: any) => {
    const response = await api.get<PaginatedResponse<ProductType>>('/api/directory/product/type/', { params });
    return response.data;
  },
  // Product Models
  getProductModels: async (params?: any) => {
    const response = await api.get<PaginatedResponse<ProductModel>>('/api/directory/product/model/', { params });
    return response.data;
  },
  // Units
  getUnits: async (params?: any) => {
    const response = await api.get<PaginatedResponse<Unit>>('/api/directory/measurement/unit/', { params });
    return response.data;
  },
  // Sizes
  getSizes: async (params?: any) => {
    const response = await api.get<PaginatedResponse<Size>>('/api/directory/measurement/size/', { params });
    return response.data;
  },
};

export default api;
