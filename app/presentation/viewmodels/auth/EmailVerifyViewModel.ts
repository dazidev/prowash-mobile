import { useState, useRef, useContext } from 'react';
import { TextInput } from 'react-native';
import { AuthService } from '../../../infrastructure';

//* tipiados.
import type { TemplateCodeInterface } from '../../../domain';
import { AuthContext } from '../../context/AuthContext';

export const useEmailVerifyViewModel = () => {
  const { setStatus } = useContext(AuthContext);
  const [timecode, setTimecode] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const [code, setCode] = useState<TemplateCodeInterface>({
    param1: '',
    param2: '',
    param3: '',
    param4: '',
  });

  const [validations, setValidations] = useState({
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

  const resendCode = async (email: string) => {
    const request = await AuthService.requestNewCode(email);
    const { success, error, time } = request;
    const timeInt = Math.floor(time);
    if (success === false && error === 'TOO_MANY_REQUESTS') {
      setTimecode(timeInt);
    }
    if (success === true) {
      await AuthService.sendEmailCode();
    }
  };

  const handleConfirm = async () => {
    const stringCode = `${code.param1}${code.param2}${code.param3}${code.param4}`;
    const numberCode = Number(stringCode);

    if (stringCode.length === 4 && 1000 <= numberCode && numberCode <= 9999) {
      const response = await AuthService.confirmCode(stringCode);

      if (response.success === false) {
        setError(`${response.message}`);
        return;
      }

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
