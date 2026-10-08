import React from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthProvider from './presentation/context/AuthProvider';
import { QuotePushProvider } from './presentation/context/QuotePushProvider';
import { AppNavigation } from './presentation/navigation/AppNavigation';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <QuotePushProvider>
          <AppNavigation />
        </QuotePushProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};
export default App;
