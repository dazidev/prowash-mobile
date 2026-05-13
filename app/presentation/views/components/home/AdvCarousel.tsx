import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../../theme/colors';
import { CarouselComponent } from '../ common/Carousel';

type ImageObj = {
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  image5: string | null;
};

interface Props {
  text: string;
  images: ImageObj;
}

export const AdvCarousel = ({ text, images }: Props) => {
  const uri = Object.values(images ?? {}) //* si images es null retorna vacio {}
    .filter((img): img is string => !!img) //* elimina null o undefined
    .map((img, i) => {
      return `https://images.prowash365.com/${img}`;
    });

  return (
    <View style={styles.container}>
      <View style={styles.containerPhoto}>
        <Text style={styles.textPhoto}>PW</Text>
      </View>
      <View style={styles.containerText}>
        <Text style={styles.textTitle}>Prowash 365</Text>
        <Text style={styles.text}>{text}</Text>
        <View style={styles.imageWrapper}>
          <CarouselComponent images={uri} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: 15,
    marginHorizontal: 8,
    marginVertical: 4,
    gap: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  containerPhoto: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: colors.darkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  containerText: {
    flex: 1,
    minWidth: 0,
  },
  textPhoto: {
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 25,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.principalWhite,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flexShrink: 1, // permite encoger
    flexWrap: 'wrap', // hace wrap
    width: '100%', // asegura el ancho del contenedor
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
    width: '100%',
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 2,
    resizeMode: 'cover',
  },
});
