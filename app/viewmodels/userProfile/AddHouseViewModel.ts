import { useContext, useEffect, useState } from "react"
import { UserService } from "../../services/userService"
import { AuthContext } from "../../context/AuthContext"
import { UserHouseResponseItem } from "../../interfaces/user/user.interface"
import { getErrorUtil, ServerErrorCode } from "../../utils/getErrorUtil"

export const INITIAL_HOUSE_STATE = {
  houseName: '',
  street: '',
  complementStreet: '',
  city: '',
  state: '',
  zipcode: '',
}

const AddHouseViewModel = () => {
  const [ fieldValue, setFieldValue ] = useState(INITIAL_HOUSE_STATE)
  const [changes, setChanges] = useState(false)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (fieldValue.houseName === '' || fieldValue.street === '' || fieldValue.city === '' ||
        fieldValue.state === '' || fieldValue.zipcode === '' ) {
          setChanges(false)
        }
    else {
      setChanges(true)
    }
  }, [fieldValue.houseName, fieldValue.street, fieldValue.city, fieldValue.state, fieldValue.zipcode])

  const handleChangeField = (value: string, option: string) => {
    setFieldValue((prev) => ({...prev, [option]: value}))
  }

  const saveChanges = async (): Promise<{success: boolean, message?: string}> => {
    const house: UserHouseResponseItem = {
      id: user?.id as string,
      name: fieldValue.houseName,
      street: fieldValue.street,
      complement_street: fieldValue.complementStreet,
      city: fieldValue.city,
      state: fieldValue.state,
      zipcode: fieldValue.zipcode
    }

    const response = await UserService.addUserHouse(house)

    if (response.success) return { success: true }
    const messageError = getErrorUtil(response.error as ServerErrorCode)
    return { success: false, message: messageError }
  }

  return {
    fieldValue,
    setFieldValue,
    handleChangeField,
    changes,
    setChanges,
    saveChanges
  }
}

export default AddHouseViewModel