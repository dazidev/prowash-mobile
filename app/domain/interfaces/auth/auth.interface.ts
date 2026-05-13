export type AuthStatus =
  | 'authenticated'
  | 'unauthenticated'
  | 'checking'
  | 'needs-email-verification';

export interface NestErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthExpiresIn {
  access: number;
  refresh: number;
}

export interface UserLoginResponse {
  user: User;
  tokens: AuthTokens;
  expiresIn: AuthExpiresIn;
}

export type UserRole = 'ADMIN' | 'MOD' | 'USER';

export interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  isPhoneMumberVerified: boolean;
  roles: UserRole[];
  status: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

/*

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
*/
