import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CleaningBackground from '../../components/CleaningBackground';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../theme/colors';

//* tipiado.
import type { ProfileStackParamList } from '../../../../domain';

type NavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'TermsConditions'
>;

export const TermsAndConditionsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <>
      <CleaningBackground />
      <ScrollView style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Terms and conditions</Text>
        </View>

        <View style={styles.optionsContainer}></View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    padding: '5%',
    marginTop: 20,
  },
  titleContainer: {
    position: 'relative',
    backgroundColor: colors.principalBlue,
    borderRadius: 15,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.principalWhite,
    textAlign: 'left',
  },
  optionsContainer: {
    position: 'relative',
    backgroundColor: colors.principalWhite,
    borderRadius: 15,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
  },
  backText: {
    fontSize: 60,
    color: colors.principalBlue,
  },
});
