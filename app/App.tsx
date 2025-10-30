import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import RootNavigator from './presentation/navigation/RootNavigator';
import AuthProvider from './presentation/context/AuthProvider';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}
export default App