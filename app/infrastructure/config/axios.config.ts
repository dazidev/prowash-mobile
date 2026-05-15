import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { Platform } from 'react-native';
import { TokenService } from '../services/auth/token.service';
import { AuthEventService } from '../services/auth/auth-event.service';

const HOST_NAME =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://192.168.100.44:3000';

export const api = axios.create({
  baseURL: HOST_NAME,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async config => {
  const accessToken = await TokenService.getAccessToken();

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;

    if (!isUnauthorized || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: token => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = await TokenService.getRefreshToken();

      if (!refreshToken) {
        await TokenService.clearTokens();
        AuthEventService.emit('session-expired');
        return Promise.reject(error);
      }

      const response = await axios.post(
        `${HOST_NAME}/api/auth/refresh-mobile`,
        {
          refreshToken,
        },
      );

      const newAccessToken = response.data.tokens.access;
      const newRefreshToken = response.data.tokens.refresh;

      await TokenService.saveTokens(newAccessToken, newRefreshToken);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      await TokenService.clearTokens();

      AuthEventService.emit('session-expired');

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
