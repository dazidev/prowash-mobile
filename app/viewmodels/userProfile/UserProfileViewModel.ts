import { useContext, useState } from "react";
import { Alert } from "react-native";
import { AuthContext } from "../../context/AuthContext";



export const UserProfileViewModel = () => {

  const [alert, setAlert] = useState();
  const { setStatus, setTokens, setUser } = useContext(AuthContext)

  const handleOptions = (option: number) => {
    switch (option) {
      case 1:
        return "EditProfile"
      case 5:
        Alert.alert(
         "Confirm logout",
         "Are you sure you want to log out?",
         [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'Logout',
            onPress: () => {
              setStatus('unauthenticated')
              setUser(undefined)
              setTokens(undefined)
            },
          }
         ]
        )
        break;
    
      default:
        break;
    }
  }

  return {
    handleOptions
  }
}