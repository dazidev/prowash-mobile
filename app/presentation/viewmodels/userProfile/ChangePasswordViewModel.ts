import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { regularExp } from '../../../domain';
import { UserService } from '../../../infrastructure';
import { getErrorUtil, ServerErrorCode } from '../../../shared';

type FieldKey = 'password' | 'newPassword' | 'repeatNewPassword';

type PropsPass = Record<FieldKey, string>;

const ChangePasswordViewModel = () => {
  const { user } = useContext(AuthContext);
  const [fieldValue, setFieldValue] = useState<PropsPass>({
    password: '',
    newPassword: '',
    repeatNewPassword: '',
  });
  const [fieldError, setFieldError] = useState<PropsPass>({
    password: '',
    newPassword: '',
    repeatNewPassword: '',
  });
  const [changes, setChanges] = useState(false);

  useEffect(() => {
    if (!regularExp.password.test(fieldValue.password))
      return setChanges(false);
    if (!regularExp.password.test(fieldValue.newPassword))
      return setChanges(false);
    if (fieldValue.newPassword === fieldValue.password)
      return setChanges(false);
    if (fieldValue.newPassword !== fieldValue.repeatNewPassword)
      return setChanges(false);
    return setChanges(true);
  }, [
    fieldValue.password,
    fieldValue.newPassword,
    fieldValue.repeatNewPassword,
  ]);

  const verifiedFormatPassword = (value: string, field: FieldKey) => {
    if (field === 'password' || field === 'newPassword') {
      if (!regularExp.password.test(value)) {
        setFieldError(prev => ({
          ...prev,
          [field]:
            '*The password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a symbol.',
        }));
      }
    } else if (field === 'repeatNewPassword') {
      if (fieldValue.newPassword !== value) {
        setFieldError(prev => ({
          ...prev,
          [field]:
            "*The new passwords don't match. Make sure both fields are identical.",
        }));
      }
    }
  };

  const validateField = (value: string, field: FieldKey) => {
    setFieldValue(prev => ({ ...prev, [field]: value }));

    if (field === 'password' || field === 'newPassword') {
      if (fieldError[field] !== '') {
        if (regularExp.password.test(value)) {
          setFieldError(prev => ({ ...prev, [field]: '' }));
        }
      }
    } else if (field === 'repeatNewPassword') {
      if (fieldValue.newPassword === value) {
        setFieldError(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const saveChanges = async (): Promise<{
    success: boolean;
    message?: string;
  }> => {
    const response = await UserService.changeUserPassword(
      user?.id as string,
      fieldValue.password,
      fieldValue.newPassword,
      fieldValue.repeatNewPassword,
    );

    if (response.success) {
      return {
        success: true,
      };
    }
    const messageError = getErrorUtil(response.error as ServerErrorCode);
    return { success: false, message: messageError };
  };

  return {
    fieldValue,
    setFieldValue,
    validateField,
    fieldError,
    verifiedFormatPassword,
    changes,
    saveChanges,
    setChanges,
  };
};

export default ChangePasswordViewModel;
