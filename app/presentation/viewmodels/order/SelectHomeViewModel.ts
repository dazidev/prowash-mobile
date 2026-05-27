import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserHouse } from '../../../domain';
import { UserService } from '../../../infrastructure';

const SelectHomeViewModel = () => {
  const { user } = useContext(AuthContext);
  const [houses, setHouses] = useState<UserHouse[]>();

  const getHouses = async () => {
    const houses = await UserService.getUserHouses();
    if (houses.data) {
      setHouses(houses.data);
    }
  };
  return {
    getHouses,
    houses,
    user,
  };
};

export default SelectHomeViewModel;
