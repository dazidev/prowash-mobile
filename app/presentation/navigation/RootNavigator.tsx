import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmailVerifyScreen from '../views/screens/auth/EmailVerifyScreen';
import LoginScreen from '../views/screens/auth/LoginScreen';
import RegisterScreen from '../views/screens/auth/RegisterScreen';
import { useContext } from 'react';
import AppTabNavigator from './AppTabNavigator';
import { AuthContext } from '../context/AuthContext';

//* tipiados.
import type { AuthStackParamList } from '../../domain';

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  EmailVerify: undefined;
};

const Root = createNativeStackNavigator<RootStackParamList>();
const Auth = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Auth.Navigator screenOptions={{ headerShown: false }}>
      <Auth.Screen name="Login" component={LoginScreen} />
      <Auth.Screen name="Register" component={RegisterScreen} />
      <Auth.Screen name="EmailVerify" component={EmailVerifyScreen} />
    </Auth.Navigator>
  );
};

const RootNavigator = () => {
  const { status } = useContext(AuthContext);
  return (
    <Root.Navigator screenOptions={{ headerShown: false }}>
      {status === 'unauthenticated' && (
        <Root.Screen name="Auth" component={AuthNavigator} />
      )}
      {status === 'needs-email-verification' && (
        <Root.Screen name="EmailVerify" component={EmailVerifyScreen} />
      )}
      {status === 'authenticated' && (
        <Root.Screen name="App" component={AppTabNavigator} />
      )}
    </Root.Navigator>
  );
};

export default RootNavigator;
