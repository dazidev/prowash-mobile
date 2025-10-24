export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking'

export interface UserLoginResponseInterface {
  id: string
  name: string
  lastname: string
  email: string
  password?: string
  phoneNumber?: string
  isEmailVerified?: boolean
  isPhoneMumberVerified?: boolean
  role?: string
  status?: string
}

export interface AuthTokensInterface {
  access: string
  refresh: string
}

export interface AuthUserResponseInterface {
  success: boolean;
  data: UserLoginResponseInterface;
  tokens: TokensInterface;
  error?: string;
}

export interface TokensInterface {
  access: string;
  refresh: string;
}

export interface UserInterface {
  id: string;
  name: string;
  lastname: string;
  email: string;
  isEmailVerified?: number;
}

export interface UserSateInterface {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export interface HandleLoginResponseInterface {
  success: boolean;
  emailVerified?: boolean;
}

export interface CredentialsInterface {
  email: string
  password: string
}