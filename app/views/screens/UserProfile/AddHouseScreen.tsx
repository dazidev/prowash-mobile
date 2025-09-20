import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../../navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import CleaningBackground from "../../components/CleaningBackground";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../theme/colors";
import { InputCustom } from "../../components/InputCustom";
import AddHouseViewModel, { INITIAL_HOUSE_STATE } from "../../../viewmodels/userProfile/AddHouseViewModel";
import { useActionSheet } from "@expo/react-native-action-sheet";
import TopNotification, { TopNotificationHandle } from "../../components/overlays/TopNotification";
import { useRef } from "react";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'AddHouse'>

const CITIES_SC = [
    "Anderson",
    "Duncan",
    "Easley",
    "Fountain Inn",
    "Greenville",
    "Greer",
    "Mauldin",
    "Moore",
    "Simpsonville",
    "Spartanburg",
    "Taylors",
    "Williamston",
  ] as const

const AddHouseScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const { 
    fieldValue,
    setFieldValue,
    handleChangeField,
    changes,
    saveChanges,
    setChanges } = AddHouseViewModel()

  const { showActionSheetWithOptions } = useActionSheet();
  const notifRef = useRef<TopNotificationHandle>(null);

  const openCitySheet = () => {
    const options = ["Cancel", ...CITIES_SC]
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 0,
        title: "Select city",
      },
      (buttonIndex) => {
        if (buttonIndex != null && buttonIndex > 0) {
          const city = CITIES_SC[buttonIndex - 1]
          handleChangeField(city, "city")
          handleChangeField('SC', 'state')
        }
      }
    )
  }

  const sanitizeStreet = (string: string) => string.normalize('NFC').replace(/[^\p{L}\p{N} \.,'\/\-&#]/gu, '');

  const onSave = async () => {
    const result = await saveChanges()
    if (!result.success) return notifRef.current?.show(result.message!, 'error');
      
    notifRef.current?.show('House saved successfully', 'success');
    setChanges(false)
    setFieldValue(() => ({...INITIAL_HOUSE_STATE}))
  }

  return (
    <>
      <CleaningBackground/>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <TopNotification ref={notifRef} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Add house</Text>
          </View>
          <View style={styles.optionsContainer}>
          
            <InputCustom
              title="*House name"
              value={fieldValue.houseName}
              onChangeText={(value) => {handleChangeField(sanitizeStreet(value), 'houseName')}}
            />

            <View style={styles.addressContainer}>
              <Text style={styles.titleAddress}>*Address</Text>
              <InputCustom
                title="*Street"
                value={fieldValue.street}
                onChangeText={(value) => {handleChangeField(sanitizeStreet(value), 'street')}}
              />

              <InputCustom
                title="Apt, int, etc (or leave blank)"
                value={fieldValue.complementStreet}
                onChangeText={(value) => {handleChangeField(sanitizeStreet(value), 'complementStreet')}}
              />
              <View style={{ width: '100%', position: 'relative' }}>
                <InputCustom
                  title="*City"
                  value={fieldValue.city}
                  onChangeText={() => {}}
                  editable={false}
                />
                <Pressable
                  onPress={openCitySheet}
                  style={StyleSheet.absoluteFillObject}
                  android_ripple={{ color: '#00000011', borderless: false }}
                />
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: '35%'}}>
                  <InputCustom
                    title="*State"
                    value={fieldValue.state}
                    editable={false}
                    onChangeText={() => {}}
                  />
                </View>
                <View style={{width: '59%'}}>
                  <InputCustom
                    title="*Zip code"
                    value={fieldValue.zipcode}
                    onChangeText={(value) => {handleChangeField(value.replace(/[^0-9-]/g, ''), 'zipcode')}}
                  />
                </View>
              </View>
            </View>
            <View style={{paddingHorizontal: 20, alignSelf: 'flex-start'}}>
              <Text style={styles.titlePhoto}>Photo of the house</Text>
            </View>
            <TouchableOpacity style={styles.buttomPhoto}>
              <Text style={styles.textButtomPhoto}>Tap to add photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onSave} 
              style={[styles.saveButton, {backgroundColor: changes ? colors.principalGreen : colors.bgInactive}]}
              disabled={!changes}
            >
              <Text style={[styles.saveText, {color: changes ? 'black' : colors.itemInactive}]}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
        
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    paddingHorizontal: '5%',
    paddingTop: '5%',
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
  titleAddress : {
    marginVertical: 10,
    fontSize: 18
  },
  addressContainer: {
    backgroundColor: "#BFDFFF20",
    borderWidth: 1,
    borderColor: '#BFDFFF90',
    paddingHorizontal: 25,
    marginHorizontal: 10,
    paddingTop: 10,
    borderRadius: 15,
  },
  titlePhoto: {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 18,
  },
  buttomPhoto: {
    width: '90%',
    height: 100,
    backgroundColor: "#BFDFFF50",
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#006ddbff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtomPhoto: {
    fontWeight: 'bold',
    color: '#006ddbff',
  },
  saveButton: {
    position: 'relative',
    width: '90%',
    height: 60,
    backgroundColor: colors.principalGreen,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  },
})

export default AddHouseScreen