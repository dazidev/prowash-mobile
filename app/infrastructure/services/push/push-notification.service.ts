import { PermissionsAndroid, Platform } from 'react-native';

import {
  deleteToken,
  getMessaging,
  getToken,
  onTokenRefresh,
} from '@react-native-firebase/messaging';

import type {
  PushDeviceDeactivation,
  PushDeviceRegistration,
  ServiceResponse,
} from '../../../domain';
import { api } from '../../config/axios.config';
import { handleApiError } from '../../../shared';

export class PushNotificationService {
  static async requestAndroidPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false;
    }

    if (Number(Platform.Version) < 33) {
      return true;
    }

    const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;

    const alreadyGranted = await PermissionsAndroid.check(permission);

    if (alreadyGranted) {
      return true;
    }

    const result = await PermissionsAndroid.request(permission, {
      title: 'Quote notifications',
      message:
        'Allow notifications to receive updates about your appointments and quotes.',
      buttonPositive: 'Continue',
      buttonNegative: 'Not now',
    });

    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  static async getAndroidToken(
    requestPermission = true,
  ): Promise<ServiceResponse<string | null>> {
    if (Platform.OS !== 'android') {
      return { success: true, data: null };
    }

    try {
      let hasPermission = true;

      if (Number(Platform.Version) >= 33) {
        hasPermission = requestPermission
          ? await this.requestAndroidPermission()
          : await PermissionsAndroid.check(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );
      }

      if (!hasPermission) {
        return { success: true, data: null };
      }

      const token = await getToken(getMessaging());

      return {
        success: true,
        data: token,
      };
    } catch {
      return {
        success: false,
        message: 'Unable to configure push notifications.',
      };
    }
  }

  static subscribeToAndroidTokenRefresh(
    callback: (token: string) => void | Promise<void>,
  ): () => void {
    if (Platform.OS !== 'android') {
      return () => {};
    }

    return onTokenRefresh(getMessaging(), async token => {
      try {
        await callback(token);
      } catch {
        console.warn('Unable to synchronize the push token.');
      }
    });
  }

  static async deleteAndroidToken(): Promise<void> {
    if (Platform.OS !== 'android') {
      return;
    }

    await deleteToken(getMessaging());
  }

  static async registerAndroidToken(
    fcmToken: string,
  ): Promise<ServiceResponse<PushDeviceRegistration>> {
    if (Platform.OS !== 'android') {
      return { success: true };
    }

    try {
      const response = await api.post<PushDeviceRegistration>(
        '/api/user/push-device',
        {
          fcmToken,
          platform: 'ANDROID',
        },
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }

  static async deactivateAndroidDevice(): Promise<
    ServiceResponse<PushDeviceDeactivation>
  > {
    if (Platform.OS !== 'android') {
      return { success: true };
    }

    try {
      const response = await api.delete<PushDeviceDeactivation>(
        '/api/user/push-device',
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }
}
