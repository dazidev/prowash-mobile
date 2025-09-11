import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"


export const EditProfileViewModel = () => {
  const { user } = useContext(AuthContext)
  const [fieldValue, setFieldValue] = useState({
    name: user?.name ?? '',
    lastname: user?.lastname ?? '',
    email: user?.email ?? '',
    phoneNumber: user?.contactNumber ?? ''
  })


  return {
    fieldValue,
    setFieldValue
  }
  
}