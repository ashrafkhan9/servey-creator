import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  Survey,
  SurveyResponse,
  DashboardData,
  SurveyAnalytics,
  PaginatedResponse,
  SurveyFilters,
  SurveyFormData,
  ResponseFormData,
  ApiError
} from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (if needed in future)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };
    return Promise.reject(apiError);
  }
);

// Survey API functions
export const surveyApi = {
  // Get all surveys with pagination and filters
  getAll: async (filters: SurveyFilters = {}): Promise<PaginatedResponse<Survey>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const response: AxiosResponse<PaginatedResponse<Survey>> = await api.get(
      `/surveys?${params.toString()}`
    );
    return response.data;
  },

  // Get survey by ID
  getById: async (id: string): Promise<Survey> => {
    const response: AxiosResponse<Survey> = await api.get(`/surveys/${id}`);
    return response.data;
  },

  // Create new survey
  create: async (surveyData: SurveyFormData): Promise<Survey> => {
    const response: AxiosResponse<Survey> = await api.post('/surveys', surveyData);
    return response.data;
  },

  // Update survey
  update: async (id: string, surveyData: Partial<SurveyFormData>): Promise<Survey> => {
    const response: AxiosResponse<Survey> = await api.put(`/surveys/${id}`, surveyData);
    return response.data;
  },

  // Delete survey
  delete: async (id: string): Promise<void> => {
    await api.delete(`/surveys/${id}`);
  },

  // Toggle survey active status
  toggleActive: async (id: string, isActive: boolean): Promise<Survey> => {
    const response: AxiosResponse<Survey> = await api.put(`/surveys/${id}`, { isActive });
    return response.data;
  },
};

// Response API functions
export const responseApi = {
  // Submit survey response
  submit: async (responseData: ResponseFormData): Promise<SurveyResponse> => {
    const response: AxiosResponse<SurveyResponse> = await api.post('/responses', responseData);
    return response.data;
  },

  // Get all responses with pagination
  getAll: async (filters: { surveyId?: string; page?: number; limit?: number } = {}): Promise<PaginatedResponse<SurveyResponse>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const response: AxiosResponse<PaginatedResponse<SurveyResponse>> = await api.get(
      `/responses?${params.toString()}`
    );
    return response.data;
  },

  // Get response by ID
  getById: async (id: string): Promise<SurveyResponse> => {
    const response: AxiosResponse<SurveyResponse> = await api.get(`/responses/${id}`);
    return response.data;
  },

  // Get responses for specific survey
  getBySurvey: async (surveyId: string, page = 1, limit = 10): Promise<PaginatedResponse<SurveyResponse>> => {
    const response: AxiosResponse<PaginatedResponse<SurveyResponse>> = await api.get(
      `/responses/survey/${surveyId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

// Analytics API functions
export const analyticsApi = {
  // Get overview analytics
  getOverview: async (): Promise<DashboardData> => {
    const response: AxiosResponse<DashboardData> = await api.get('/analytics/overview');
    return response.data;
  },

  // Get analytics for specific survey
  getSurveyAnalytics: async (surveyId: string): Promise<SurveyAnalytics> => {
    const response: AxiosResponse<SurveyAnalytics> = await api.get(`/analytics/survey/${surveyId}`);
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string; uptime: number }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Export the axios instance for custom requests
export default api;
