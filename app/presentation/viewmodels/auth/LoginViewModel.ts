import { useState } from 'react';
import { AuthService } from '../../../infrastructure';
import { useAuth } from '../../hooks/auth/useAuth';

import type { AuthCredentials } from '../../../domain';

export interface HandleLoginResponse {
  success: boolean;
  emailVerified?: boolean;
}

export const LoginViewModel = () => {
  const { loginUser, requireEmailVerification } = useAuth();
  const [credentials, setCredentials] = useState<AuthCredentials>({
    email: '',
    password: '',
  });
  const [validations, setValidations] = useState({
    email: true,
    password: true,
  });
  const [error, setError] = useState<string>('');

  //* loading
  const [isLoading, setIsLoading] = useState(false);

  const verifyEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const verifyPassword = (password: string) =>
    password.length >= 8 ? true : false;

  const handleValidation = (field: keyof AuthCredentials, value: boolean) => {
    setValidations(prev => ({ ...prev, [field]: value }));
  };

  const handleChange = (field: keyof AuthCredentials, value: string) => {
    if (field === 'email') {
      setCredentials(prev => ({ ...prev, [field]: value }));
      handleValidation(field, verifyEmail(value));
    } else if (field === 'password') {
      setCredentials(prev => ({ ...prev, [field]: value }));
      handleValidation(field, verifyPassword(value));
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setError('');
    const emailIsOk = verifyEmail(email);
    const passwordIsOk = verifyPassword(password);

    handleValidation('email', emailIsOk);
    handleValidation('password', passwordIsOk);

    if (!emailIsOk || !passwordIsOk) {
      setError(
        'Please check your email and password. Make sure all fields are filled out correctly.',
      );
      return;
    }
    const response = await AuthService.login(email, password);

    if (!response.success) {
      setError(`${response.message}`);
      return;
    }

    if (response.data) {
      const user = response.data.user;
      const tokens = response.data.tokens;

      if (!user.isEmailVerified) {
        await requireEmailVerification(user, tokens);
        await AuthService.sendEmailCode();
        return;
      }

      await loginUser(user, tokens);
      return;
    }

    return { success: false };
  };

  return {
    credentials,
    handleChange,
    error,
    setError,
    validations,
    handleLogin,
    isLoading,
    setIsLoading,
  };
};
