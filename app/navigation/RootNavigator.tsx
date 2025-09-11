import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmailVerifyScreen from "../views/screens/Authentication/EmailVerifyScreen"
import LoginScreen from "../views/screens/Authentication/LoginScreen"
import RegisterScreen from "../views/screens/Authentication/RegisterScreen"
import { AuthStackParamList, RootStackParamList } from "./navigation.types";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AppTabNavigator from "./AppTabNavigator";


const Root = createNativeStackNavigator<RootStackParamList>()
const Auth = createNativeStackNavigator<AuthStackParamList>()


const AuthNavigator = () => {
  return (
    <Auth.Navigator screenOptions={{ headerShown: false }}>
      <Auth.Screen name="Login" component={LoginScreen}/>
      <Auth.Screen name="Register" component={RegisterScreen} />
      <Auth.Screen name="EmailVerify" component={EmailVerifyScreen}/>
    </Auth.Navigator>
  )
}

const RootNavigator = () => {
  const { status } = useContext(AuthContext)
  return (
    <Root.Navigator screenOptions={{ headerShown: false }}>
      { status === 'unauthenticated' && <Root.Screen name="Auth" component={AuthNavigator} /> }
      { status === 'authenticated' && <Root.Screen name="App" component={AppTabNavigator} /> }
    </Root.Navigator>
  )
}

export default RootNavigator