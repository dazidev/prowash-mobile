import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';

import type { RefreshMobileResponse } from '../../domain';
import { TokenService } from '../services/auth/token.service';
import { AuthEventService } from '../services/auth/auth-event.service';

const HOST_NAME =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const api = axios.create({
  baseURL: HOST_NAME,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

function isSessionEndpoint(url?: string) {
  const pathname = (url ?? '').split('?')[0];

  return [
    '/api/auth/login-mobile',
    '/api/auth/refresh-mobile',
    '/api/auth/logout-mobile',
  ].some(endpoint => pathname.endsWith(endpoint));
}

api.interceptors.request.use(async config => {
  if (isSessionEndpoint(config.url)) return config;

  const accessToken = await TokenService.getAccessToken();

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return config;
});

let refreshPromise: Promise<RefreshMobileResponse> | null = null;

export function refreshMobileSession(): Promise<RefreshMobileResponse> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshToken = await TokenService.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const { data } = await axios.post<RefreshMobileResponse>(
        `${HOST_NAME}/api/auth/refresh-mobile`,
        { refreshToken },
        { timeout: 5000 },
      );

      if (
        !data ||
        typeof data.accessToken !== 'string' ||
        !data.accessToken ||
        typeof data.refreshToken !== 'string' ||
        !data.refreshToken ||
        data.refreshToken === refreshToken ||
        typeof data.accessTokenExpiresIn !== 'number' ||
        !Number.isFinite(data.accessTokenExpiresIn) ||
        data.accessTokenExpiresIn <= 0 ||
        typeof data.refreshTokenExpiresIn !== 'number' ||
        !Number.isFinite(data.refreshTokenExpiresIn) ||
        data.refreshTokenExpiresIn <= 0
      ) {
        throw new Error('Invalid refresh response');
      }

      await TokenService.saveTokens(data.accessToken, data.refreshToken);

      return data;
    } catch (error: unknown) {
      try {
        await TokenService.clearTokens();
      } catch {
        console.warn('Unable to clear stored authentication tokens.');
      }

      AuthEventService.emit('session-expired');

      throw error;
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isSessionEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const currentAccessToken = await TokenService.getAccessToken();
    const sentAuthorization = originalRequest.headers.get('Authorization');

    if (
      currentAccessToken &&
      sentAuthorization !== `Bearer ${currentAccessToken}`
    ) {
      originalRequest.headers.set(
        'Authorization',
        `Bearer ${currentAccessToken}`,
      );

      return api(originalRequest);
    }

    const refreshed = await refreshMobileSession();

    originalRequest.headers.set(
      'Authorization',
      `Bearer ${refreshed.accessToken}`,
    );

    return api(originalRequest);
  },
);
