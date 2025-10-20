import { useState } from 'react';
import { AuthService } from '../../../infrastructure';
import { getErrorUtil, ServerErrorCode } from '../../../shared';

//* tipiado.
import type { AuthUserResponseInterface, UserRegisterInterface, ValidationsRegistrerInterface } from '../../../domain';


export const useRegisterViewModel = () => {

  //* user
  const [user, setUser] = useState<UserRegisterInterface>({
    name: '',
    lastname: '',
    email: '',
    password: '',
  })

  //* data
  const [repeatPassword, setRepeatPassword] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [error, setError] = useState<string | null>(null)

  //* validations
  const [validations, setValidations] = useState({
    name: true,
    lastname: true,
    email: true,
    password: true,
    samePassword: true,
    terms: false,
    error: ''
  })

  //* loading
  const [isLoading, setIsLoading] = useState(false)

  const verifyNameAndLastname = (text: string) => /^[A-Za-zÀ-ÿ\s'-]{2,30}$/.test(text)
  const verifyEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const verifyPassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
  const verifySamePassword = (password: string, repeatPassword: string) => repeatPassword == password

  const handleValidation = (field: keyof ValidationsRegistrerInterface, value: boolean | string) => {
    setValidations((prev) => ({ ...prev, [field]: value }))
  };

  const handleValidate = (field: keyof ValidationsRegistrerInterface, value: string) => {
    switch (field) {
      case 'name':
      case 'lastname':
        value = value.trim()
        setUser((prev) => ({ ...prev, [field]: value }))
        handleValidation(field, verifyNameAndLastname(value))
        break;
      case 'email':
        value = value.trim();
        setUser((prev) => ({ ...prev, [field]: value }))
        handleValidation(field, verifyEmail(value))
        break;
      case 'password':
        setUser((prev) => ({ ...prev, [field]: value }))
        handleValidation(field, verifyPassword(value))
        break;
      case 'samePassword':
        setRepeatPassword(value)
        handleValidation(field, verifySamePassword(value, user.password!))
        break;
      default:
        break;
    }
  }

  const handleRegister = async (): Promise<string | null> => {
    const nameIsOk = verifyNameAndLastname(user.name.trim())
    const lastnameIsOk = verifyNameAndLastname(user.lastname.trim())
    const emailIsOk = verifyEmail(user.email.trim())
    const passwordIsOk = verifyPassword(user.password!)
    const samePasswordIsOk = verifySamePassword(user.password!, repeatPassword)

    setValidations((prev) => ({ ...prev, name: nameIsOk }))
    setValidations((prev) => ({ ...prev, lastname: lastnameIsOk }))
    setValidations((prev) => ({ ...prev, email: emailIsOk }))
    setValidations((prev) => ({ ...prev, password: passwordIsOk }))
    setValidations((prev) => ({ ...prev, samePassword: samePasswordIsOk }))

    if (!nameIsOk && !lastnameIsOk && !emailIsOk && !passwordIsOk && !samePasswordIsOk) {
      handleValidation('error', 'There are errors in one or more fields. Please review and correct them before continuing.')
      return null
    }
    if (!validations.terms) {
      handleValidation('error', 'You must accept the terms and conditions to continue.')
      return null
    }
    const result = await requestRegister()
    return result
  }


  const requestRegister = async (): Promise<string | null> => {
    try {
      setIsLoading(true)

      const userBody = {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        password: user.password
      }

      const response: AuthUserResponseInterface = await AuthService.registerUser(userBody)

      if (!response.success) {
        handleValidation('error', getErrorUtil(response.error as ServerErrorCode) || 'An error occurred.')
        return null
      }

      const { id, name, lastname, email } = response.data
      
      await AuthService.sendEmailCode(email, name, lastname, id)
      return id

    } catch (error) {
      handleValidation('error', 'A network error occurred. Please try again later.')
      return null
    } 
  }

  return {
    user,
    handleRegister,
    validations,
    setValidations,
    repeatPassword,
    handleValidate,
    isLoading,
    setIsLoading
  };
};