import { createContext } from 'react';

//* tipiado.
import type { AuthStatus, AuthTokens, User } from '../../domain';

export interface AuthState {
  status: AuthStatus;
  tokens?: AuthTokens | undefined;
  user?: User | undefined;
  setStatus: (status: AuthStatus) => void;
  setTokens: (tokens: AuthTokens | undefined) => void;
  setUser: (user: User | undefined) => void;
}

export const AuthContext = createContext<AuthState>({
  status: 'checking',
  tokens: undefined,
  user: undefined,
  setStatus: () => {},
  setTokens: () => {},
  setUser: () => {},
});
