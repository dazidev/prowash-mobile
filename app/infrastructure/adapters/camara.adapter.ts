import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

export class CamaraAdapter {
  static async takePicture(): Promise<string[]> {
    const response = await launchCamera({
      mediaType: 'photo',
      quality: 0.7,
      cameraType: 'back',
    });

    if (response.assets && response.assets[0].uri) {
      return [response.assets[0].uri];
    }

    return [];
  }

  static async getPicturesFromLibrary(limit: number): Promise<Asset[]> {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      selectionLimit: limit,
    });

    if (response.assets && response.assets[0].uri) {
      return response.assets.map(asset => asset!);
    }

    return [];
  }
}
