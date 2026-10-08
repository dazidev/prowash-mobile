import { useState, useRef, useContext } from 'react';
import { TextInput } from 'react-native';
import { AuthService } from '../../../infrastructure';

//* tipiados.
import type { TemplateCodeInterface } from '../../../domain';
import { AuthContext } from '../../context/AuthContext';

export const useEmailVerifyViewModel = () => {
  const { user, setUser, setStatus } = useContext(AuthContext);
  const resendingRef = useRef(false);
  const [timecode, setTimecode] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const [code, setCode] = useState<TemplateCodeInterface>({
    param1: '',
    param2: '',
    param3: '',
    param4: '',
  });

  const [, setValidations] = useState({
    param1: true,
    param2: true,
    param3: true,
    param4: true,
  });

  //* loading
  const [isLoading, setIsLoading] = useState(false);

  const input2 = useRef<TextInput | null>(null);
  const input3 = useRef<TextInput | null>(null);
  const input4 = useRef<TextInput | null>(null);

  const verifyNumberCode = (value: string): boolean => {
    return value === '' || /^[0-9]$/.test(value);
  };

  const handleValidate = (
    field: keyof TemplateCodeInterface,
    value: string,
    nextRef?: React.RefObject<TextInput | null>,
  ) => {
    const onlyOneDigit = verifyNumberCode(value);
    setValidations(prev => ({ ...prev, [field]: onlyOneDigit }));
    if (onlyOneDigit === true) {
      setCode(prev => ({ ...prev, [field]: value }));
      if (value !== '' && nextRef?.current) {
        nextRef.current.focus();
      }
    }
  };

  const resendCode = async () => {
    if (resendingRef.current || timecode > 0) return;

    resendingRef.current = true;
    setError('');

    try {
      const response = await AuthService.sendEmailCode();

      if (!response.success) {
        setError(response.message ?? 'Unable to resend the verification code.');
        return;
      }

      setTimecode(60);
    } catch {
      setError('Unable to resend the verification code. Please try again.');
    } finally {
      resendingRef.current = false;
    }
  };

  const handleConfirm = async () => {
    const stringCode = `${code.param1}${code.param2}${code.param3}${code.param4}`;
    const numberCode = Number(stringCode);

    if (stringCode.length === 4 && numberCode >= 1000 && numberCode <= 9999) {
      const response = await AuthService.confirmCode(stringCode);

      if (response.success === false) {
        setError(`${response.message}`);
        return;
      }

      if (user) {
        setUser({
          ...user,
          isEmailVerified: true,
        });
      }

      setError('');
      setStatus('authenticated');
      return;
    }

    setError('Please enter the verification code to continue.');
    return;
  };

  return {
    code,
    setCode,
    handleValidate,
    input2,
    input3,
    input4,
    resendCode,
    timecode,
    setTimecode,
    handleConfirm,
    error,
    isLoading,
    setIsLoading,
  };
};
