import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseURL } from './constants';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor: always set the latest token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

/**
 * GET request
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient
    .get<T>(url, config)
    .then((res: AxiosResponse<T>) => res.data)
    .catch((err) => {
      console.error(`GET ${url} failed`, err);
      return err;
    });
}

/**
 * POST request
 */
export async function post<T, U = unknown>(url: string, data: U, config?: AxiosRequestConfig): Promise<T> {
  return apiClient
    .post<T>(url, data, config)
    .then((res: AxiosResponse<T>) => res.data)
    .catch((err) => {
      console.error(`POST ${url} failed`, err);
      return err
    });
}

/**
 * PUT request
 */
export async function put<T, U = unknown>(url: string, data: U, config?: AxiosRequestConfig): Promise<T> {
  return apiClient
    .put<T>(url, data, config)
    .then((res: AxiosResponse<T>) => res.data)
    .catch((err) => {
      console.error(`PUT ${url} failed`, err);
      return err;
    });
}

/**
 * DELETE request
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient
    .delete<T>(url, config)
    .then((res: AxiosResponse<T>) => res.data)
    .catch((err) => {
      console.error(`DELETE ${url} failed`, err);
      return err;
    });
}

export const api = {
  get,
  post,
  put,
  delete: del,
};

// Add a flag to prevent repeated calls
let isBackendDown = false;

export const getUserStakings = async (): Promise<any> => {
  // If backend is down, return empty data immediately
  if (isBackendDown) {
    return { stakings: [], totalStaked: 0, totalRewards: 0 };
  }

  try {
    const response = await api.get('/users/stakings');
    return response['data'];
  } catch (error: any) {
    console.error('Failed to fetch user stakings:', error);
    // Mark backend as down to prevent repeated calls
    isBackendDown = true;
    // Return empty data instead of throwing
    return { stakings: [], totalStaked: 0, totalRewards: 0 };
  }
};
