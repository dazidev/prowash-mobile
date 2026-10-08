import axios from 'axios';

import { api, refreshMobileSession } from '../../config/axios.config';

import {
  ServiceResponse,
  UserLoginResponse,
  UserRegisterInterface,
  RefreshMobileResponse,
  UserRegisterResponse,
} from '../../../domain';
import { DeviceService } from './device.service';
import type { User } from '../../../domain/interfaces/auth/auth.interface';
import { handleApiError } from '../../../shared';

export class AuthService {
  static async registerUser(
    user: UserRegisterInterface,
  ): Promise<ServiceResponse<UserRegisterResponse>> {
    try {
      const response = await api.post<UserRegisterResponse>(
        '/api/auth/register',
        user,
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
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
      return handleApiError(error);
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

  static async refresh(): Promise<ServiceResponse<RefreshMobileResponse>> {
    try {
      const data = await refreshMobileSession();

      return {
        success: true,
        data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
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
