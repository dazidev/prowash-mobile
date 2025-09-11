import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ProfileStackParamList } from '../../../navigation/navigation.types'
import CleaningBackground from "../../components/CleaningBackground";
import { InputCustom } from "../../components/InputCustom";
import { EditProfileViewModel } from "../../../viewmodels/userProfile/EditProfileViewModel";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;

export const EditProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const { fieldValue, setFieldValue } = EditProfileViewModel()


  return (
    <>
      <CleaningBackground/>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        
        <View style={styles.containerOptions}>
          <InputCustom 
            title={'First name*'}
            value={fieldValue.name}
            onChangeText={ (text) => {
              const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
              setFieldValue((prev) => ({...prev, name: onlyLetters}))
            }}
            error=""
          />
          <InputCustom
            title={'Last name*'}
            value={fieldValue.lastname}
            onChangeText={ (text) => {
              const onlyLetters = text.replace(/[^A-Za-z\s]/g, "")
              setFieldValue((prev) => ({...prev, name: onlyLetters}))
            }}
          />
          <InputCustom 
            title={'Email*'}
            value={fieldValue.email}
            onChangeText={ (text) => setFieldValue((prev) => ({...prev, email: text}))}
            block={true}
            successMessage="Email successfully verified"
          />
          <InputCustom 
            title={'Phone number'}
            value={fieldValue.phoneNumber}
            onChangeText={ (text) => setFieldValue((prev) => ({...prev, phoneNumber: text}))}
          />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          
        </View>
      </View>
    </>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  containerOptions: {
    position: 'relative',
    backgroundColor: '#FFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#0D47A1',
    textAlign: 'left',
    marginTop: 100,
  },
  subtitle: {
    fontSize: 22,
    fontFamily: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 20,
    marginTop: 10,
  },
  link: {
    color: '#000',
    textAlign: 'left',
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
  },
  backText: {
    fontSize: 60,
    color: '#0D47A1',
  },
  error: {
    color: '#D9363E',
    marginTop: 10,
    paddingLeft: 6,
    fontSize: 16,
  },
});