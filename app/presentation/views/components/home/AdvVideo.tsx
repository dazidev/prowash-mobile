import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../../theme/colors';
import { VimeoWebView } from '../video/VimeoWebView';

interface Props {
  text: string;
  video: string;
}

export const AdvVideo = ({ text, video }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerPhoto}>
        <Text style={styles.textPhoto}>PW</Text>
      </View>
      <View style={styles.containerText}>
        <Text style={styles.textTitle}>Prowash 365</Text>
        <Text style={styles.text}>{text}</Text>
        <View style={styles.imageWrapper}>
          <VimeoWebView videoId={video} />
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
