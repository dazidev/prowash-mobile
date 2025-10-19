import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import RootNavigator from './presentation/navigation/RootNavigator';
import AuthProvider from './presentation/context/AuthProvider';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  )
}
export default App