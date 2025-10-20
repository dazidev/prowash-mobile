import { createContext } from "react"

//* tipiado.
import type { AuthStatus, AuthTokensInterface, UserLoginResponseInterface } from "../../domain"


export interface AuthState {
  status: AuthStatus
  tokens?: AuthTokensInterface | undefined
  user?: UserLoginResponseInterface | undefined
  setStatus: (status: AuthStatus) => void
  setTokens: (tokens: AuthTokensInterface | undefined) => void
  setUser: (user: UserLoginResponseInterface | undefined) => void
}

export const AuthContext = createContext<AuthState>({
  status: 'checking',
  tokens: undefined,
  user: undefined,
  setStatus: () => {},
  setTokens: () => {},
  setUser: () => {}
})
