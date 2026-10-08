import { useCallback, useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';

import type { AuthStatus } from '../../../domain';
import { PushNotificationService } from '../../../infrastructure';

export function usePushRegistration(status: AuthStatus, userId?: string) {
  const stopRef = useRef<(() => Promise<void>) | null>(null);

  const stopPushRegistration = useCallback(async () => {
    await stopRef.current?.();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android' || status !== 'authenticated' || !userId) {
      return;
    }

    let active = true;
    let permissionRequested = false;
    let queue: Promise<void> = Promise.resolve();

    let unsubscribeToken: () => void = () => {};

    let appStateSubscription:
      | ReturnType<typeof AppState.addEventListener>
      | undefined;

    const synchronize = () => {
      if (!active) {
        return;
      }

      queue = queue
        .then(async () => {
          if (!active || AppState.currentState !== 'active') {
            return;
          }

          const shouldRequestPermission = !permissionRequested;
          permissionRequested = true;

          const tokenResponse = await PushNotificationService.getAndroidToken(
            shouldRequestPermission,
          );

          if (!active) {
            return;
          }

          if (!tokenResponse.success) {
            console.warn('Unable to obtain the push token.');
            return;
          }

          if (!tokenResponse.data) {
            const response =
              await PushNotificationService.deactivateAndroidDevice();

            if (active && !response.success) {
              console.warn('Unable to deactivate push notifications.');
            }

            return;
          }

          const response = await PushNotificationService.registerAndroidToken(
            tokenResponse.data,
          );

          if (active && !response.success) {
            console.warn('Unable to register push notifications.');
          }
        })
        .catch(() => {
          if (active) {
            console.warn('Unable to synchronize push notifications.');
          }
        });
    };

    const stop = (): Promise<void> => {
      if (active) {
        active = false;
        unsubscribeToken();
        appStateSubscription?.remove();
      }

      return queue;
    };

    stopRef.current = stop;

    try {
      unsubscribeToken = PushNotificationService.subscribeToAndroidTokenRefresh(
        () => {
          synchronize();
        },
      );

      appStateSubscription = AppState.addEventListener('change', nextState => {
        if (nextState === 'active') {
          synchronize();
        }
      });

      synchronize();
    } catch {
      void stop();
      console.warn('Unable to initialize push notifications.');
    }

    return () => {
      void stop();

      if (stopRef.current === stop) {
        stopRef.current = null;
      }
    };
  }, [status, userId]);

  return { stopPushRegistration };
}
