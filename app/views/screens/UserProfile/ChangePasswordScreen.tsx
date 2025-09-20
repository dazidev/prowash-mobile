import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import CleaningBackground from "../../components/CleaningBackground"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { InputCustom } from "../../components/InputCustom";
import ChangePasswordViewModel from "../../../viewmodels/userProfile/ChangePasswordViewModel";
import { useRef } from "react";
import TopNotification, { TopNotificationHandle } from "../../components/overlays/TopNotification";
import { colors } from "../../../theme/colors";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'ChangePassword'>;


export const ChangePasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const {
    fieldValue,
    fieldError,
    validateField,
    verifiedFormatPassword,
    changes,
    saveChanges,
    setChanges
  } = ChangePasswordViewModel()
  const notifRef = useRef<TopNotificationHandle>(null);

  const onSave = async () => {
    const result = await saveChanges()
    if (!result.success) return notifRef.current?.show(result.message!, 'error');
      
    notifRef.current?.show('Changes saved successfully', 'success');
    setChanges(false)
  }

  return (
    <>
      <CleaningBackground/>
      <View style={styles.conainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <TopNotification ref={notifRef} />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Change password</Text>
        </View>

        <View style={styles.optionsContainer}>

          <InputCustom
            title="Current password*"
            value={fieldValue.password}
            onChangeText={(value) =>  validateField(value, "password")}
            password={true}
            error={fieldError.password}
            onBlur={() => verifiedFormatPassword(fieldValue.password, 'password')}
          />

          <InputCustom
            title="New password*"
            value={fieldValue.newPassword}
            onChangeText={(value) =>  validateField(value, "newPassword")}
            password={true}
            error={fieldError.newPassword}
            onBlur={() => verifiedFormatPassword(fieldValue.newPassword, 'newPassword')}
          />

          <InputCustom
            title="Repeat new password*"
            value={fieldValue.repeatNewPassword}
            onChangeText={(value) =>  validateField(value, 'repeatNewPassword')}
            password={true}
            error={fieldError.repeatNewPassword}
            onBlur={() => verifiedFormatPassword(fieldValue.repeatNewPassword, 'repeatNewPassword')}
          />

          <TouchableOpacity 
            onPress={onSave} 
            style={[styles.saveButton, {backgroundColor: changes ? colors.principalGreen : colors.bgInactive}]}
            disabled={!changes}
          >
            <Text style={[styles.saveText, {color: changes ? 'black' : colors.itemInactive}]}>Save</Text>
          </TouchableOpacity>

        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  conainer: {
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
  saveButton: {
    position: 'relative',
    width: '90%',
    height: 60,
    backgroundColor: colors.principalGreen,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  },
})