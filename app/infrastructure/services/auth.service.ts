import axios from 'axios';

import { api } from '../config/axios.config';

import { useContext } from 'react';
import { AuthContext } from '../../presentation';
import {
  ServiceResponse,
  UserLoginResponse,
  UserRegisterInterface,
} from '../../domain';
import { DeviceService } from './device.service';
import { type NestErrorResponse } from '../../domain/interfaces/auth/auth.interface';
import { handleApiError, isNestErrorResponse } from '../../shared';

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
  static async sendEmailCode(
    email: string,
    name: string,
    lastname: string,
    userId: string,
  ) {
    try {
      const jsonEmail = {
        email: email,
        name: name,
        lastname: lastname,
        userId: userId,
      };
      const response = await api.post(
        '/api/auth/register/verify-email',
        jsonEmail,
      );
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
  static async confirmCode(userId: string, code: string) {
    try {
      const jsonCode = {
        userId: userId,
        code: code,
      };
      const response = await api.post(
        '/api/auth/register/verify-email-code',
        jsonCode,
      );
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

  static async checkStatus() {
    try {
      const response = await api.get('/api/auth/check-status');

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }
}
