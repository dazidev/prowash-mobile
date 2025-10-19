import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AuthService, TokenService } from "../../../infrastructure";

//* tipiados.
import type { AuthTokensInterface, AuthUserResponseInterface, CredentialsInterface, HandleLoginResponseInterface, UserLoginResponseInterface } from "../../../domain";


export const LoginViewModel = () => {
  const { setStatus, setTokens, setUser } = useContext(AuthContext)
  const [credentials, setCredentials] = useState<CredentialsInterface>({
    email: '',
    password: ''
  })
  const [validations, setValidations] = useState({
    email: true,
    password: true
  })
  const [error, setError] = useState({
    success: true,
    message: ''
  })

  const verifyEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const verifyPassword = (password: string) => password.length >= 8 ? true : false

  const handleValidation = (field: keyof CredentialsInterface, value: boolean) => {
    setValidations((prev) => ({ ...prev, [field]: value }))
  }

  const handleChange = (field: keyof CredentialsInterface, value: string) => {
    if (field === 'email') {
      setCredentials((prev) => ({ ...prev, [field]: value }))
      handleValidation(field, verifyEmail(value))
    } else if (field === 'password') {
      setCredentials((prev) => ({ ...prev, [field]: value }))
      handleValidation(field, verifyPassword(value))
    }
  }

  const setDataUserContext = (user: UserLoginResponseInterface, tokens: AuthTokensInterface) => {
    setStatus('authenticated')
    setTokens(tokens)
    setUser(user)
  }

  const handleLogin = async (email: string, password: string): Promise<HandleLoginResponseInterface> => {
    const emailIsOk = verifyEmail(email)
    const passwordIsOk = verifyPassword(password)

    handleValidation('email', emailIsOk)
    handleValidation('password', passwordIsOk)

    if (!emailIsOk || !passwordIsOk) {
      setError({ success: false, message: 'Please check your email and password. Make sure all fields are filled out correctly.' })
      return { success: false }
    }
    try {
      const response: AuthUserResponseInterface = await AuthService.confirmLogin(email, password)
      if (response.success === false) {
        if (response.error === 'USER_NOT_FOUND') {
          setError({ success: false, message: 'Invalid email or password. Please check your credentials and try again.' })
        }
        return { success: false }
      } else {
        setDataUserContext(response.data, response.tokens)
        TokenService.saveTokens(response.tokens.access, response.tokens.refresh)
        if (response.data.isEmailVerified === 0) {
          await AuthService.sendEmailCode(response.data.email, response.data.name, response.data.lastname, response.data.id)
        }
        return {
          success: true,
          emailVerified: response.data.isEmailVerified === 1 ? true : false
        }
      }
    } catch (error) {
      setError({ success: false, message: error as string })
      return { success: false }
    }
  }


  return {
    credentials,
    handleChange,
    error,
    setError,
    validations,
    handleLogin
  }
}