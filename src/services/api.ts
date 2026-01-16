import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import type { LoginCredentials, AuthResponse } from '../types/auth'; // We need to define these types
import type { EmployeeDetail, EmployeeListItem, EmployeeCreateUpdate } from '../types/employee';
import type { PaginatedResponse, Region, District, Department, Position, ProductType, ProductModel, Unit, Size } from '../types/reference';
import type { Permission, UserWithPermissions } from '../types/permission';

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
  },
  getEmployees: async (params?: any) => {
    const response = await api.get<PaginatedResponse<EmployeeListItem>>('/api/staff/employees/', { params });
    return response.data;
  },
  getEmployee: async (id: number) => {
    const response = await api.get<EmployeeDetail>(`/api/staff/employees/${id}/`);
    return response.data;
  },
  createEmployee: async (data: EmployeeCreateUpdate) => {
    const response = await api.post<EmployeeDetail>('/api/staff/employees/', data);
    return response.data;
  },
  updateEmployee: async (id: number, data: EmployeeCreateUpdate) => {
    const response = await api.put<EmployeeDetail>(`/api/staff/employees/${id}/`, data);
    return response.data;
  },
  deleteEmployee: async (id: number) => {
    await api.delete(`/api/staff/employees/${id}/`);
  },
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
  createDepartment: async (data: any) => {
    const response = await api.post<Department>('/api/directory/organization/department/', data);
    return response.data;
  },
  updateDepartment: async (id: number, data: any) => {
    const response = await api.patch<Department>(`/api/directory/organization/department/${id}/`, data);
    return response.data;
  },
  deleteDepartment: async (id: number) => {
    await api.delete(`/api/directory/organization/department/${id}/`);
  },
  // Positions
  getPositions: async (params?: any) => {
    const response = await api.get<PaginatedResponse<Position>>('/api/directory/organization/position/', { params });
    return response.data;
  },
  createPosition: async (data: any) => {
    const response = await api.post<Position>('/api/directory/organization/position/', data);
    return response.data;
  },
  updatePosition: async (id: number, data: any) => {
    const response = await api.patch<Position>(`/api/directory/organization/position/${id}/`, data);
    return response.data;
  },
  deletePosition: async (id: number) => {
    await api.delete(`/api/directory/organization/position/${id}/`);
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

export const permissionApi = {
  getPermissions: async () => {
    const response = await api.get<Permission[]>('/api/users/types/permissions/');
    return response.data;
  },
  getUsers: async (params?: any) => {
    const response = await api.get<PaginatedResponse<UserWithPermissions> | UserWithPermissions[]>('/api/users/types/users/', { params });
    return response.data;
  },
  getUserWithPermissions: async (id: number) => {
    const response = await api.get<UserWithPermissions>(`/api/users/types/users/${id}/`); // Assuming retrieving a single user works this way or we interpret the list. The spec shows PATCH on {id} but GET on list. I might need to find the user from the list if there is no detail endpoint, but typical REST has detail. The spec snippet had PATCH /api/users/types/users/{id}/ and GET /api/users/types/users/. I will assume GET /api/users/types/users/{id}/ exists or I might have to fetch all and find. Let's try to fetch detail. If it fails I'll fix. Wait, the spec ONLY showed PATCH for {id}. It showed GET for list. I will try GET {id} hoping it exists, otherwise I'll need to use the list endpoint.
    // Spec inspection: "paths": { "/api/users/types/users/{id}/": { "patch": ... } } - NO GET defined for specific ID in the snippet I saw!
    // However, usually it exists. If not, I'll have to use list and filter.
    // Let's assume standard REST for now, or use list if I must. The snippet ended at line 204.
    // Let's safely use the list and find for now if I want to be 100% sure, or just assume the detail endpoint exists but wasn't in the snippet (snippet was start of file).
    // Actually, I saw the Whole file content in step 10, lines 1-204. It ended at line 204.
    // The paths were `/api/users/types/users/{id}/` (PATCH only visible), `/api/users/types/users/` (GET), `/api/users/types/permissions/` (GET).
    // So there is NO GET /api/users/types/users/{id}/ in the spec provided.
    // I should implement fetching the list and finding the user.
    return api.get<any>(`/api/users/types/users/`).then(res => {
      const data = res.data;
      if (Array.isArray(data)) {
        return data.find((u: UserWithPermissions) => u.id === Number(id));
      } else if (data.results && Array.isArray(data.results)) {
        return data.results.find((u: UserWithPermissions) => u.id === Number(id));
      }
      return null;
    });
  },
  updateUserPermissions: async (id: number, permissionIds: number[]) => {
    const response = await api.patch<UserWithPermissions>(`/api/users/types/users/${id}/`, { user_permissions: permissionIds });
    return response.data;
  }
};

export default api;
