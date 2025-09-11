import { useState } from 'react';
import { AuthService } from '../services/AuthService';
import { IValidationsRegistrer } from '../interfaces/ValidationsModel';
import { IAuthUserResponse, IUserSate } from '../interfaces/auth/AuthInterface';
import { getErrorUtil, ServerErrorCode } from '../utils/getErrorUtil';

export const useRegisterViewModel = () => {

  //user
  const [user, setUser] = useState<IUserSate>({
    name: '',
    lastname: '',
    email: '',
    password: '',
  })

  //data
  const [repeatPassword, setRepeatPassword] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [error, setError] = useState<string | null>(null)

  //validations
  const [validations, setValidations] = useState({
    name: true,
    lastname: true,
    email: true,
    password: true,
    samePassword: true,
    terms: false,
    error: ''
  })

  const verifyNameAndLastname = (text: string) => /^[A-Za-zÀ-ÿ\s'-]{2,30}$/.test(text)
  const verifyEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const verifyPassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
  const verifySamePassword = (password: string, repeatPassword: string) => repeatPassword == password

  const handleValidation = (field: keyof IValidationsRegistrer, value: boolean | string) => {
    setValidations((prev) => ({ ...prev, [field]: value }))
  };

  const handleValidate = ( field: keyof IValidationsRegistrer, value: string ) => {
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
        handleValidation(field, verifySamePassword(value, user.password))
        break;
      default:
        break;
    }
  }

  const handleRegister = async ():Promise<boolean> => {
    const nameIsOk = verifyNameAndLastname(user.name.trim())
    const lastnameIsOk = verifyNameAndLastname(user.lastname.trim())
    const emailIsOk = verifyEmail(user.email.trim())
    const passwordIsOk = verifyPassword(user.password!)
    const samePasswordIsOk = verifySamePassword(user.password, repeatPassword)

    setValidations((prev) => ({...prev, name: nameIsOk}))
    setValidations((prev) => ({...prev, lastname: lastnameIsOk}))
    setValidations((prev) => ({...prev, email: emailIsOk}))
    setValidations((prev) => ({...prev, password: passwordIsOk}))
    setValidations((prev) => ({...prev, samePassword: samePasswordIsOk}))

    if (!nameIsOk && !lastnameIsOk && !emailIsOk && !passwordIsOk && !samePasswordIsOk) {
      handleValidation('error', 'There are errors in one or more fields. Please review and correct them before continuing.')
      return false
    }
    if (!validations.terms) {
      handleValidation('error', 'You must accept the terms and conditions to continue.')
      return false
    }
    try {
      const response: IAuthUserResponse = await AuthService.registerUser(user)
      // console.log(response.success)
      if (response.success) {
        // console.log('User registered successfully');
        await AuthService.sendEmailCode(user.email, user.name, user.lastname)
        return true
      } else {
        handleValidation('error', getErrorUtil(response.error as ServerErrorCode) || 'An error occurred.')
        // console.error('Error ' + response.error + ': ' + response.message)
        return false
      }
    } catch (error) {
      console.error('❌ Error de red o servidor:', error);
      handleValidation('error', 'A network error occurred. Please try again later.')
      return false
    }


  }

  return {
    user,
    handleRegister,
    validations,
    setValidations,
    repeatPassword,
    handleValidate
  };
};