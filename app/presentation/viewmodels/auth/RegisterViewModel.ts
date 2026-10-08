import { useRef, useState } from 'react';
import { Alert } from 'react-native';

import { AuthService } from '../../../infrastructure';
import { useAuth } from '../../hooks/auth/useAuth';

import type {
  UserRegisterInterface,
  ValidationsRegistrerInterface,
} from '../../../domain';

export const useRegisterViewModel = () => {
  const { requireEmailVerification } = useAuth();
  const submittingRef = useRef(false);

  const [user, setUser] = useState<UserRegisterInterface>({
    name: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [repeatPassword, setRepeatPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [validations, setValidations] = useState({
    name: true,
    lastname: true,
    email: true,
    password: true,
    samePassword: true,
    terms: false,
    error: '',
  });

  const verifyNameAndLastname = (text: string) =>
    /^[A-Za-zÀ-ÿ\s'-]{2,30}$/.test(text);

  const verifyEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const verifyPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const handleValidation = (
    field: keyof ValidationsRegistrerInterface,
    value: boolean | string,
  ) => {
    setValidations(prev => ({ ...prev, [field]: value }));
  };

  const handleValidate = (
    field: keyof ValidationsRegistrerInterface,
    value: string,
  ) => {
    switch (field) {
      case 'name':
      case 'lastname':
        setUser(prev => ({ ...prev, [field]: value }));
        handleValidation(field, verifyNameAndLastname(value.trim()));
        break;

      case 'email':
        setUser(prev => ({ ...prev, email: value }));
        handleValidation(field, verifyEmail(value.trim()));
        break;

      case 'password':
        setUser(prev => ({ ...prev, password: value }));
        handleValidation(field, verifyPassword(value));
        break;

      case 'samePassword':
        setRepeatPassword(value);
        handleValidation(field, value === user.password);
        break;
    }
  };

  const handleRegister = async (): Promise<void> => {
    if (submittingRef.current) return;

    const userBody = {
      name: user.name.trim(),
      lastname: user.lastname.trim(),
      email: user.email.trim().toLowerCase(),
      password: user.password,
    };

    const nameIsOk = verifyNameAndLastname(userBody.name);
    const lastnameIsOk = verifyNameAndLastname(userBody.lastname);
    const emailIsOk = verifyEmail(userBody.email);
    const passwordIsOk = verifyPassword(userBody.password);
    const samePasswordIsOk = userBody.password === repeatPassword;

    setValidations(prev => ({
      ...prev,
      name: nameIsOk,
      lastname: lastnameIsOk,
      email: emailIsOk,
      password: passwordIsOk,
      samePassword: samePasswordIsOk,
      error: '',
    }));

    if (
      !nameIsOk ||
      !lastnameIsOk ||
      !emailIsOk ||
      !passwordIsOk ||
      !samePasswordIsOk
    ) {
      handleValidation(
        'error',
        'Please review and correct the highlighted fields.',
      );
      return;
    }

    if (!validations.terms) {
      handleValidation(
        'error',
        'You must accept the terms and conditions to continue.',
      );
      return;
    }

    submittingRef.current = true;
    setIsLoading(true);

    try {
      const registration = await AuthService.registerUser(userBody);

      if (!registration.success || !registration.data) {
        handleValidation(
          'error',
          registration.message ?? 'Unable to create your account.',
        );
        return;
      }

      const login = await AuthService.login(userBody.email, userBody.password);

      if (!login.success || !login.data) {
        handleValidation(
          'error',
          'Your account was created, but sign-in failed. Please use Log In to continue.',
        );
        return;
      }

      await requireEmailVerification(login.data.user, login.data.tokens);

      const codeResponse = await AuthService.sendEmailCode();

      if (!codeResponse.success) {
        Alert.alert(
          'Verification code',
          codeResponse.message ??
            'Unable to send the code. Use RESEND CODE to try again.',
        );
      }
    } catch {
      handleValidation(
        'error',
        'Unable to complete registration. If your account was created, use Log In to continue.',
      );
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  };

  return {
    user,
    handleRegister,
    validations,
    setValidations,
    repeatPassword,
    handleValidate,
    isLoading,
  };
};
