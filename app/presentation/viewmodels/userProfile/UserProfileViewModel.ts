import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { AuthService } from '../../../infrastructure';

export const UserProfileViewModel = () => {
  const [alert, setAlert] = useState();
  const { setStatus, setTokens, setUser, tokens } = useContext(AuthContext);

  const handleLogout = async () => {
    if (tokens?.refresh) {
      await AuthService.logout(tokens.refresh);
    }
    setStatus('unauthenticated');
    setUser(undefined);
    setTokens(undefined);
  };

  const handleOptions = (option: number) => {
    switch (option) {
      case 1:
        return 'EditProfile';
      case 3:
        return 'ManageHouses';
      case 4:
        return 'TermsConditions';
      case 5:
        Alert.alert('Confirm logout', 'Are you sure you want to log out?', [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'Logout',
            onPress: handleLogout,
          },
        ]);
        break;

      default:
        break;
    }
  };

  return {
    handleOptions,
  };
};
