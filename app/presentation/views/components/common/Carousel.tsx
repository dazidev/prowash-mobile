import Carousel from 'react-native-reanimated-carousel';
import { Dimensions, View, Image } from 'react-native';

const { width } = Dimensions.get('window');

export function CarouselComponent({ images }: { images: string[] }) {
  return (
    <Carousel
      width={width}
      height={(width * 2) / 3} // relación 3:2
      autoPlay
      data={images}
      scrollAnimationDuration={1000 * 2} // 2 segundos
      renderItem={({ item }) => (
        <View style={{ flex: 1, overflow: 'hidden', borderRadius: 12 }}>
          <Image
            source={{ uri: item }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      )}
    />
  );
}
