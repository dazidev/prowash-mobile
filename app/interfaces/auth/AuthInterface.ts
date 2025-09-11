export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking'

export interface IUserLoginResponse {
  id?: string
  name: string
  lastname: string
  email: string
  password?: string
  contactNumber?: string
  isEmailVerified?: number
  isPhoneVerified?: number
  role?: string
  status?: string
}

export interface IAuthTokens {
  access: string
  refresh: string
}

export interface IAuthUserResponse {
  success: boolean;
  user:    IUserLoginResponse;
  tokens:  Tokens;
  error?: string;
}

export interface Tokens {
  access:  string;
  refresh: string;
}

export interface User {
  id:              string;
  name:            string;
  lastname:        string;
  email:           string;
  isEmailVerified?: number;
}

export interface IUserSate {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export interface HandleLoginResponse {
  success: boolean;
  emailVerified?: boolean;
}