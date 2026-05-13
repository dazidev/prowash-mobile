import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';

type Props = {
  text: string;
  type: 'error' | 'success';
};

export const NotificationCustom = ({ text, type }: Props) => {
  return (
    <View
      style={[
        style.notContainer,
        {
          backgroundColor: type === 'error' ? colors.bgError : colors.bgSuccess,
        },
      ]}
    >
      <Ionicons
        name={type === 'error' ? 'close-sharp' : 'checkmark-sharp'}
        size={32}
        color={type === 'error' ? colors.itemError : colors.itemSuccess}
      />
      <Text style={[style.notText]}>{text}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  notContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 70,
    paddingLeft: 15,
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  notText: {
    fontSize: 20,
    color: 'black',
    paddingLeft: 15,
  },
});
