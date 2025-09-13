import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { UserService } from "../../services/userService"
import { IUserLoginResponse } from "../../interfaces/auth/AuthInterface"


export const EditProfileViewModel = () => {
  const { user, setUser } = useContext(AuthContext)
  const [fieldValue, setFieldValue] = useState({
    name: user?.name ?? '',
    lastname: user?.lastname ?? '',
    email: user?.email ?? '',
    phoneNumber: user?.contactNumber ?? ''
  })
  const [changes, setChanges] = useState(false)
  const [error, setError] = useState({
    name: '',
    lastname: '',
  })

  useEffect(() => {
    if (fieldValue?.name === user?.name && fieldValue?.lastname === user?.lastname){
      setChanges(false)
    } else if (fieldValue?.name === '' || fieldValue?.lastname === '') {
      setChanges(false)
    }
    else setChanges(true)
  }, [fieldValue, user?.name, user?.lastname])

  const validateText = (text: string, option: string) => {
    setError((prev) => ({...prev, [option]: ''}))

    const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
    setFieldValue((prev) => ({...prev, [option]: onlyLetters}))

    const optionName = option === 'name' ? 'Name' : 'Last name'
    if (onlyLetters === '') setError((prev) => ({...prev, [option]: `*${optionName} is required.`}))
  }
 
  const saveChanges = async () => {
    if ( fieldValue?.name !== '' && fieldValue?.lastname !== '') {
      const response: UserEditInfoResponseInterface = await UserService.editPersonalInfo(user?.id as string, fieldValue.name, fieldValue.lastname)
      if (response.success) {
        setUser({...user!, name: response.data.name, lastname: response.data.lastname})
      }
    }
  }

  return {
    fieldValue,
    setFieldValue,
    error,
    validateText,
    changes,
    saveChanges
  }
  
}