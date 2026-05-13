import { useState } from 'react';
import { AuthService, TokenService } from '../../../infrastructure';

//* tipiados.
import {
  type AuthUserResponseInterface,
  type CredentialsInterface,
  type HandleLoginResponseInterface,
} from '../../../domain';
import { useAuth } from '../../hooks/auth/useAuth';

export const LoginViewModel = () => {
  const { loginUser } = useAuth();
  const [credentials, setCredentials] = useState<CredentialsInterface>({
    email: '',
    password: '',
  });
  const [validations, setValidations] = useState({
    email: true,
    password: true,
  });
  const [error, setError] = useState({
    success: true,
    message: '',
  });

  //* loading
  const [isLoading, setIsLoading] = useState(false);

  const verifyEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const verifyPassword = (password: string) =>
    password.length >= 8 ? true : false;

  const handleValidation = (
    field: keyof CredentialsInterface,
    value: boolean,
  ) => {
    setValidations(prev => ({ ...prev, [field]: value }));
  };

  const handleChange = (field: keyof CredentialsInterface, value: string) => {
    if (field === 'email') {
      setCredentials(prev => ({ ...prev, [field]: value }));
      handleValidation(field, verifyEmail(value));
    } else if (field === 'password') {
      setCredentials(prev => ({ ...prev, [field]: value }));
      handleValidation(field, verifyPassword(value));
    }
  };

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<HandleLoginResponseInterface> => {
    const emailIsOk = verifyEmail(email);
    const passwordIsOk = verifyPassword(password);

    handleValidation('email', emailIsOk);
    handleValidation('password', passwordIsOk);

    if (!emailIsOk || !passwordIsOk) {
      setError({
        success: false,
        message:
          'Please check your email and password. Make sure all fields are filled out correctly.',
      });
      return { success: false };
    }
    try {
      const response: AuthUserResponseInterface =
        await AuthService.confirmLogin(email, password);
      if (response.success === false) {
        if (response.error === 'USER_NOT_FOUND') {
          setError({
            success: false,
            message:
              'Invalid email or password. Please check your credentials and try again.',
          });
        }
        return { success: false };
      } else {
        console.log('este es el usuario v');
        console.log(response.data);
        await loginUser(response.data, response.tokens);
        if (response.data.isEmailVerified === false) {
          await AuthService.sendEmailCode(
            response.data.email,
            response.data.name,
            response.data.lastname,
            response.data.id,
          );
        }
        return {
          success: true,
          emailVerified: response.data.isEmailVerified,
        };
      }
    } catch (error) {
      setError({ success: false, message: error as string });
      return { success: false };
    }
  };

  return {
    credentials,
    handleChange,
    error,
    setError,
    validations,
    handleLogin,
    isLoading,
  };
};
