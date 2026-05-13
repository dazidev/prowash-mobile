import { useCallback, useContext } from 'react';

import { AuthContext } from '../../../presentation';
import { AuthService, TokenService } from '../../../infrastructure';
import type { AuthTokens, User } from '../../../domain';

export function useAuth() {
  const { setStatus, setTokens, setUser } = useContext(AuthContext);

  const loginUser = useCallback(
    async (user: User, tokens: AuthTokens) => {
      setStatus('authenticated');
      setTokens(tokens);
      setUser(user);
      await TokenService.saveTokens(tokens.access, tokens.refresh);
    },
    [setStatus, setTokens, setUser],
  );

  const requireEmailVerification = useCallback(
    async (user: User, tokens: AuthTokens) => {
      setStatus('needs-email-verification');
      setTokens(tokens);
      setUser(user);
      await TokenService.saveTokens(tokens.access, tokens.refresh);
    },
    [setStatus, setTokens, setUser],
  );

  const cancelEmailVerification = useCallback(async () => {
    try {
      const refreshToken = await TokenService.getRefreshToken();

      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
    } catch (error) {
      console.log('Error cancelling email verification session', error);
    } finally {
      await TokenService.clearTokens();

      setUser(undefined);
      setTokens(undefined);
      setStatus('unauthenticated');
    }
  }, [setStatus, setTokens, setUser]);

  return {
    loginUser,
    requireEmailVerification,
    cancelEmailVerification,
  };
}
