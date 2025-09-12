import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { ProfileStackParamList } from '../../../navigation/navigation.types'
import CleaningBackground from "../../components/CleaningBackground";
import { InputCustom } from "../../components/InputCustom";
import { EditProfileViewModel } from "../../../viewmodels/userProfile/EditProfileViewModel";
import { ButtomCustom } from "../../components/ButtomCustom";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;

export const EditProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const { 
    fieldValue,
    setFieldValue,
    error,
    validateText,
    changes,
    saveChanges
  } = EditProfileViewModel()

  

  return (
    <>
      <CleaningBackground/>
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>My personal information</Text>
        </View>
        
        <View style={styles.containerOptions}>
          <InputCustom 
            title={'First name*'}
            value={fieldValue.name}
            onChangeText={ (text) => validateText(text, "name") }
            error={error.name}
          />
          <InputCustom
            title={'Last name*'}
            value={fieldValue.lastname}
            onChangeText={ (text) => validateText(text, "lastname") }
            error={error.lastname}
          />
          <InputCustom 
            title={'Email*'}
            value={fieldValue.email}
            onChangeText={ (text) => setFieldValue((prev) => ({...prev, email: text}))}
            block={true}
            successMessage="Email successfully verified"
          />
          { fieldValue.phoneNumber && (
              <InputCustom 
                title={'Phone number'}
                value={fieldValue.phoneNumber}
                onChangeText={ (text) => setFieldValue((prev) => ({...prev, phoneNumber: text}))}
              />
            )
          }
          { !fieldValue.phoneNumber && (
              <ButtomCustom
                title="Add phone number"
                colorTitle="#11bf22"
              />
            )
          }
          
          <TouchableOpacity 
            onPress={saveChanges} 
            style={[styles.saveButton, {backgroundColor: changes ? '#c8ff01' : '#efefef'}]}
            disabled={!changes}
          >
            <Text style={[styles.saveText, {color: changes ? 'black' : '#a8a6a6'}]}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>More settings</Text>
        </View>

        <View style={styles.containerOptions}>
          <ButtomCustom
            title="Change password"
            colorTitle="black"
          />
          <ButtomCustom
            title="Change email"
            colorTitle="black"
          />
          { !fieldValue.phoneNumber && ( //cambiar cuando ya este funcionando lo del número
              <ButtomCustom
                title="Change phone number"
                colorTitle="black"
              />
            )
          }
          <ButtomCustom
            title="Delete account"
            colorTitle="red"
          />
        </View>
        <View style={{margin: '5%'}}></View>
      </ScrollView>
    </>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    padding: '5%',
    marginTop: 20,
  },
  titleContainer: {
    position: 'relative',
    backgroundColor: '#0D47A1',
    borderRadius: 15,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  containerOptions: {
    position: 'relative',
    backgroundColor: '#FFF',
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
    color: '#FFF',
    textAlign: 'left',
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
  saveButton: {
    position: 'relative',
    width: '90%',
    height: 60,
    backgroundColor: '#c8ff01',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
  },
  backText: {
    fontSize: 60,
    color: '#0D47A1',
  },
  saveText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  },
  error: {
    color: '#D9363E',
    marginTop: 10,
    paddingLeft: 6,
    fontSize: 16,
  },
});