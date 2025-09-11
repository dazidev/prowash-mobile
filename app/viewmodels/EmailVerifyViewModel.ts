import { useState, useRef } from 'react';
import { TextInput } from 'react-native';
import { ITemplateCode } from '../interfaces/ValidationsModel';
import { AuthService } from '../services/AuthService';

export const useEmailVerifyViewModel = () => {
  const [timecode, setTimecode] = useState<number>(0)
  const [error, setError] = useState({
    success: false, 
    message: ''
  })

  const [code, setCode] = useState<ITemplateCode>({
    param1: '',
    param2: '',
    param3: '',
    param4: ''
  })

  const [validations, setValidations] = useState({
    param1: true,
    param2: true,
    param3: true,
    param4: true,
  })

  const input2 = useRef<TextInput | null>(null)
  const input3 = useRef<TextInput | null>(null)
  const input4 = useRef<TextInput | null>(null)

  const verifyNumberCode = (value: string): boolean => {
    return value === '' || /^[0-9]$/.test(value)
  }

  const handleValidate = (field: keyof ITemplateCode, value: string, nextRef?: React.RefObject<TextInput | null>) => {
    const onlyOneDigit = verifyNumberCode(value)
    setValidations((prev) => ({ ...prev, [field]: onlyOneDigit }))
    if (onlyOneDigit === true){
      setCode((prev) => ({ ...prev, [field]: value }))
      if (value !== '' && nextRef?.current) {
        nextRef.current.focus()
      }
    }
  }

  const resendCode = async (email: string, name: string, lastname: string) => {
    const request = await AuthService.requestNewCode(email)
    const {success, error, time} = request
    const timeInt = Math.floor(time)
    if (success === false && error === 'TOO_MANY_REQUESTS') {
      setTimecode(timeInt)
    }
    if (success === true){
      await AuthService.sendEmailCode(email, name, lastname)
    }
  }

  const handleConfirm = async (email: string):Promise<boolean> => {
    const stringCode = `${code.param1}${code.param2}${code.param3}${code.param4}`
    const numberCode = Number(stringCode)

    if (stringCode.length === 4 && (1000 <= numberCode) && (numberCode <= 9999)) {
      const response = await AuthService.confirmCode(email, stringCode)

      if (response.success === false) {
        if (response.error === 'CODE_NOT_FOUND') {
          setError({ success: true, message: 'The verification code you entered is invalid. Please try again.' })
          return false
        } else if (response.error === 'CODE_EXPIRED') {
          setError({ success: true, message: 'The verification code has expired. Please request a new one to continue.' })
          return false
        } else if (response.error === 'IS_EMAIL_VERIFIED_ERROR') {
          setError({ success: true, message: 'Please contact to support.' })
          return false
        } else return false
      } else {
        return true
      }
    } else { 
      setError({ success: true, message: 'Please enter the verification code to continue.' })
      return false
    }

  }

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
    error
  }
}