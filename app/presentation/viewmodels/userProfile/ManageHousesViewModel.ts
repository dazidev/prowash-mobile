import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserService } from '../../../infrastructure';

//* tipiado.
import type { UserHouse } from '../../../domain';

const ManageHousesViewModel = () => {
  const { user } = useContext(AuthContext);
  const [houses, setHouses] = useState<UserHouse[]>();

  const getHouses = async () => {
    const houses = await UserService.getUserHouses();
    if (houses.data) {
      setHouses(houses.data);
    }
  };

  const deleteHouse = async (houseId: string) => {
    const deleteHouse = await UserService.deleteUserHouse(houseId);
    return deleteHouse;
  };

  return {
    getHouses,
    houses,
    user,
    deleteHouse,
  };
};

export default ManageHousesViewModel;
