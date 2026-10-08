import { useCallback, useContext } from 'react';

import { AuthContext } from '../../../presentation';
import { TokenService } from '../../../infrastructure';
import type { AuthTokens, User } from '../../../domain';

export function useAuth() {
  const { setStatus, setTokens, setUser, logoutUser } = useContext(AuthContext);

  const loginUser = useCallback(
    async (user: User, tokens: AuthTokens) => {
      await TokenService.saveTokens(tokens.access, tokens.refresh);

      setTokens(tokens);
      setUser(user);
      setStatus('authenticated');
    },
    [setStatus, setTokens, setUser],
  );

  const requireEmailVerification = useCallback(
    async (user: User, tokens: AuthTokens) => {
      await TokenService.saveTokens(tokens.access, tokens.refresh);
      setTokens(tokens);
      setUser(user);

      setStatus('needs-email-verification');
    },
    [setStatus, setTokens, setUser],
  );

  const cancelEmailVerification = useCallback(async () => {
    await logoutUser();
  }, [logoutUser]);

  return {
    loginUser,
    requireEmailVerification,
    cancelEmailVerification,
  };
}
