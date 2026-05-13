import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  colorTitle: string;
  onPress?: () => void;
};

export const ButtomCustom: React.FC<Props> = ({
  title,
  colorTitle,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.customButton}>
      <Text style={[styles.text, { color: colorTitle }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customButton: {
    width: '90%',
    height: 60,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#c4c4c4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
  },
});
