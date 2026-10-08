/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './app/App';
import { name as appName } from './app.json';
import { Platform } from 'react-native';

import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

if (Platform.OS === 'android') {
  setBackgroundMessageHandler(
    getMessaging(),
    () => Promise.resolve(),
  );
}

AppRegistry.registerComponent(appName, () => App);
