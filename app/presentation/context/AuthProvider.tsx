import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { AuthContext } from './AuthContext';

import {
  AuthService,
  TokenService,
  AuthEventService,
  PushNotificationService,
} from '../../infrastructure';

import type { AuthStatus, AuthTokens, User } from '../../domain';
import { usePushRegistration } from '../hooks/push/usePushRegistration';

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [tokens, setTokens] = useState<AuthTokens | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);

  const { stopPushRegistration } = usePushRegistration(status, user?.id);
  const logoutTaskRef = useRef<Promise<void> | null>(null);

  const endSession = useCallback(
    (revokeSession: boolean): Promise<void> => {
      if (logoutTaskRef.current) {
        return logoutTaskRef.current;
      }

      const task = (async () => {
        try {
          await stopPushRegistration();

          if (revokeSession) {
            const refreshToken = await TokenService.getRefreshToken();

            if (refreshToken) {
              const response = await AuthService.logout(refreshToken);

              if (!response.success) {
                console.warn('Unable to revoke the session on the server.');
              }
            }
          }
        } catch {
          console.warn('Unable to complete the remote logout.');
        } finally {
          try {
            await PushNotificationService.deleteAndroidToken();
          } catch {
            console.warn('Unable to delete the push token.');
          }

          try {
            await TokenService.clearTokens();
          } catch {
            console.warn('Unable to clear stored authentication tokens.');
          } finally {
            setUser(undefined);
            setTokens(undefined);
            setStatus('unauthenticated');
          }
        }
      })();

      logoutTaskRef.current = task;

      void task.then(
        () => {
          logoutTaskRef.current = null;
        },
        () => {
          logoutTaskRef.current = null;
        },
      );

      return task;
    },
    [stopPushRegistration],
  );

  const logoutLocal = useCallback(() => endSession(false), [endSession]);

  const logoutUser = useCallback(() => endSession(true), [endSession]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const accessToken = await TokenService.getAccessToken();
      const refreshToken = await TokenService.getRefreshToken();

      if (!accessToken || !refreshToken) {
        await logoutLocal();
        return;
      }

      const response = await AuthService.checkStatus();

      if (!response.success || !response.data) {
        await logoutLocal();
        return;
      }

      const checkedUser = response.data;

      const currentAccessToken = await TokenService.getAccessToken();
      const currentRefreshToken = await TokenService.getRefreshToken();

      if (!currentAccessToken || !currentRefreshToken) {
        await logoutLocal();
        return;
      }

      setUser(checkedUser);
      setTokens({
        access: currentAccessToken,
        refresh: currentRefreshToken,
      });

      setStatus(
        checkedUser.isEmailVerified
          ? 'authenticated'
          : 'needs-email-verification',
      );
    } catch (error) {
      await logoutLocal();
    }
  }, [logoutLocal]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    const unsubscribe = AuthEventService.subscribe(
      'session-expired',
      logoutLocal,
    );

    return unsubscribe;
  }, [logoutLocal]);

  return (
    <AuthContext.Provider
      value={{
        status,
        tokens,
        user,
        setStatus,
        setTokens,
        setUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
