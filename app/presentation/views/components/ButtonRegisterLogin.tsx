import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

type Props = {
  title: string;
  color: string;
  onPress: () => void;
  isLoading: boolean;
};

const ButtonRegisterLogin = ({ title, color, onPress, isLoading }: Props) => {
  const handlePress = () => {
    if (isLoading) return;
    onPress();
  };

  return (
    <TouchableOpacity
      style={[{ backgroundColor: color }, styles.button]}
      disabled={isLoading}
      onPress={handlePress}
    >
      {isLoading === false ? (
        <Text style={styles.buttonText}>{title} </Text>
      ) : (
        <ActivityIndicator color={'black'} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 70,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ButtonRegisterLogin;
