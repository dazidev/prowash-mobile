import axios from 'axios';

import { api } from '../../config/axios.config';

import {
  ServiceResponse,
  UserLoginResponse,
  UserRegisterInterface,
} from '../../../domain';
import { DeviceService } from './device.service';
import type { User } from '../../../domain/interfaces/auth/auth.interface';
import { handleApiError } from '../../../shared';
import { TokenService } from './token.service';

export class AuthService {
  static async registerUser(user: UserRegisterInterface) {
    try {
      const response = await api.post('/api/auth/register/user', user);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Unable to connect. Please try again later.',
      };
    }
  }
  static async sendEmailCode(): Promise<ServiceResponse<undefined>> {
    try {
      await api.post('/api/auth/send-email-code');
      return {
        success: true,
        message: 'Code sent',
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: 'Unable to connect. Please try again later.',
      };
    }
  }
  static async requestNewCode(email: string) {
    try {
      const jsonEmail = {
        email: email,
      };
      const response = await api.post('/api/auth/register/new-code', jsonEmail);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Unable to connect. Please try again later.',
      };
    }
  }
  static async confirmCode(code: string): Promise<ServiceResponse<undefined>> {
    try {
      await api.post('/api/auth/verify-email-code', { code });
      return {
        success: true,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }

  static async login(
    email: string,
    password: string,
  ): Promise<ServiceResponse<UserLoginResponse>> {
    const deviceId = await DeviceService.getOrCreateDeviceId();
    const deviceInfo = await DeviceService.getDeviceInfo();
    try {
      const response = await api.post('/api/auth/login-mobile', {
        email,
        password,
        deviceId,
        deviceInfo,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }

  static async logout(
    refreshToken: string,
  ): Promise<ServiceResponse<undefined>> {
    try {
      await api.post('/api/auth/logout-mobile', { refreshToken });

      return { success: true };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }

  static async refresh(): Promise<ServiceResponse<undefined>> {
    const refreshToken = await TokenService.getRefreshToken();

    if (!refreshToken) {
      return {
        success: false,
        message: 'No refresh token found',
      };
    }

    try {
      const response = await api.post('/api/auth/refresh-mobile', {
        refreshToken,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Session expired',
      };
    }
  }

  static async checkStatus(): Promise<ServiceResponse<User>> {
    try {
      const response = await api.get<User>('/api/auth/check-status');

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid session',
      };
    }
  }
}
