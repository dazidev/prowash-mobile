import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Asset } from 'react-native-image-picker';
import { UserService } from '../../../infrastructure';
import { getErrorUtil, ServerErrorCode } from '../../../shared';

//* tipiados.
import type { UserHouseResponse, UserHouseResponseItem } from '../../../domain';

export const INITIAL_HOUSE_STATE = {
  houseName: '',
  street: '',
  complementStreet: '',
  city: '',
  state: '',
  zipcode: '',
};

const AddHouseViewModel = () => {
  const [fieldValue, setFieldValue] = useState(INITIAL_HOUSE_STATE);
  const [changes, setChanges] = useState(false);
  const [photo, setPhoto] = useState<Asset>();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (
      fieldValue.houseName === '' ||
      fieldValue.street === '' ||
      fieldValue.city === '' ||
      fieldValue.state === '' ||
      fieldValue.zipcode === ''
    ) {
      setChanges(false);
    } else {
      setChanges(true);
    }
  }, [
    fieldValue.houseName,
    fieldValue.street,
    fieldValue.city,
    fieldValue.state,
    fieldValue.zipcode,
  ]);

  const handleChangeField = (value: string, option: string) => {
    setFieldValue(prev => ({ ...prev, [option]: value }));
  };

  const saveChanges = async (): Promise<{
    success: boolean;
    message?: string;
  }> => {
    const house: UserHouseResponseItem = {
      id: user?.id as string,
      name: fieldValue.houseName,
      street: fieldValue.street,
      complement_street: fieldValue.complementStreet,
      city: fieldValue.city,
      state: fieldValue.state,
      zipcode: fieldValue.zipcode,
    };

    const response: UserHouseResponse = await UserService.addUserHouse(house);

    if (!response.success)
      return {
        success: false,
        message: getErrorUtil(response.error as ServerErrorCode),
      };

    const { id } = await response.data;

    if (photo) {
      const imageResponse = await UserService.uploadHousePhoto(
        photo,
        id,
        user?.id!,
      );
      if (!imageResponse.success)
        return {
          success: false,
          message: getErrorUtil(imageResponse.error as ServerErrorCode),
        };
    }

    return { success: true };
  };

  return {
    fieldValue,
    setFieldValue,
    handleChangeField,
    changes,
    setChanges,
    saveChanges,
    photo,
    setPhoto,
  };
};

export default AddHouseViewModel;
