import { createContext } from "react"

//* tipiado.
import type { AuthStatus, IAuthTokens, IUserLoginResponse } from "../../domain"


export interface AuthState {
  status: AuthStatus
  tokens?: IAuthTokens | undefined
  user?: IUserLoginResponse | undefined
  setStatus: (status: AuthStatus) => void
  setTokens: (tokens: IAuthTokens | undefined) => void
  setUser: (user: IUserLoginResponse | undefined) => void
}

export const AuthContext = createContext<AuthState>({
  status: 'checking',
  tokens: undefined,
  user: undefined,
  setStatus: () => {},
  setTokens: () => {},
  setUser: () => {}
})
