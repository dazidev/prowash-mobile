import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { AuthContext } from './AuthContext';

import {
  AuthService,
  TokenService,
  AuthEventService,
} from '../../infrastructure';

import type { AuthStatus, AuthTokens, User } from '../../domain';

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState<AuthStatus>('checking');

  const [tokens, setTokens] = useState<AuthTokens | undefined>(undefined);

  const [user, setUser] = useState<User | undefined>(undefined);

  const logoutLocal = useCallback(async () => {
    await TokenService.clearTokens();

    setUser(undefined);
    setTokens(undefined);
    setStatus('unauthenticated');
  }, []);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
