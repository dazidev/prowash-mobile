import { useCallback, useContext } from 'react';

import { AuthContext } from '../../../presentation';
import { TokenService } from '../../../infrastructure';
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

  return {
    loginUser,
  };
}
