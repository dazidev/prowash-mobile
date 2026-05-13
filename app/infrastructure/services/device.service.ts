import * as Keychain from 'react-native-keychain';
import uuid from 'react-native-uuid';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

const DEVICE_ID_SERVICE = 'prowash_device_id';

export class DeviceService {
  static async getOrCreateDeviceId(): Promise<string> {
    const credentials = await Keychain.getGenericPassword({
      service: DEVICE_ID_SERVICE,
    });

    if (credentials) {
      return credentials.password;
    }

    const deviceId = uuid.v4() as string;

    await Keychain.setGenericPassword('device_id', deviceId, {
      service: DEVICE_ID_SERVICE,
    });

    return deviceId;
  }

  static async getDeviceInfo(): Promise<string> {
    const brand = DeviceInfo.getBrand();
    const model = DeviceInfo.getModel();
    const systemName = DeviceInfo.getSystemName();
    const systemVersion = DeviceInfo.getSystemVersion();

    return `${Platform.OS} | ${brand} ${model} | ${systemName} ${systemVersion}`;
  }
}
