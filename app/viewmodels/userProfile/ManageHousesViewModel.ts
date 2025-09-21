import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { UserService } from "../../services/userService"
import { UserBasicResponseInterface, UserHousesResponse } from "../../interfaces/user/user.interface"


const ManageHousesViewModel = () => {
  const { user } = useContext(AuthContext)
  const [houses, setHouses] = useState<UserHousesResponse>()

  const getHouses = async () => {
    const houses = await UserService.getUserHouses(user?.id!)
    setHouses(houses)
  }

  const deleteHouse = async (houseId: string): Promise<UserBasicResponseInterface> => {
    const deleteHouse = await UserService.deleteUserHouse(user?.id!, houseId)
    return deleteHouse
  }

  return {
    getHouses,
    houses,
    user,
    deleteHouse
  }
}

export default ManageHousesViewModel