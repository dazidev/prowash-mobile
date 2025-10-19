import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import CleaningBackground from "../../components/CleaningBackground"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import HouseCard from "../../components/HouseCard";
import ManageHousesViewModel from "../../../viewmodels/userProfile/ManageHousesViewModel";
import { useEffect, useRef } from "react";
import TopNotification, { TopNotificationHandle } from "../../components/overlays/TopNotification";
import { colors } from "../../../theme/colors";

//* tipiado.
import type { ProfileStackParamList, UserHouseResponseItem } from "../../../../domain";


type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'ManageHouses'>;


export const ManageHousesScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const { getHouses, houses, user, deleteHouse } = ManageHousesViewModel()
  const notifRef = useRef<TopNotificationHandle>(null);
  
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      getHouses()
    })
    return unsub
  }, [navigation])

  const handleAddHome = () => {
    const count = houses?.data?.length ?? 0;
    if (count < 3) return navigation.navigate('AddHouse')
    notifRef.current?.show('You can’t add more than 3 houses', 'error')
      
  }

  const handleDeleteHouse = async (houseId: string) => {
    Alert.alert(
      "Confirm delete house",
      "Are you sure you want to delete this house?",
      [
        { 
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Delete',
          onPress: () => onDeleteHouse(houseId)
        }
      ]
    )
  }

  const onDeleteHouse = async (houseId: string) => {
    const response = await deleteHouse(houseId)
    if (!response.success) return notifRef.current?.show(response?.error!, 'error')
    notifRef.current?.show('House deleted successfully', 'success')
    getHouses()
  }

  return (
    <>
      <CleaningBackground/>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <TopNotification ref={notifRef} />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>My houses</Text>
          {houses?.success && (
            <TouchableOpacity 
              style={styles.addButtom}
              onPress={handleAddHome}
            >
              <Text style={styles.textButtom}>+ Add house</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.optionsContainer}>
            {!houses?.success && (
              <TouchableOpacity 
                style={[styles.addButtom, {width: '90%', height: 60, justifyContent: 'center', borderRadius: 30}]}
                onPress={() => navigation.navigate('AddHouse')}
              >
                <Text style={[styles.textButtom, {fontSize: 24, fontWeight: 'bold'}]}>+ Add house</Text>
              </TouchableOpacity>
            )}
            {houses?.success && (
              <FlatList<UserHouseResponseItem> 
                style={{width: '100%'}}
                contentContainerStyle={{width: '100%', paddingHorizontal: '5%'}}
                data={houses?.data ?? []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <HouseCard
                    name={item.name}
                    street={item.street}
                    complementStreet={item.complement_street}
                    city={item.city}
                    state={item.state}
                    zipcode={item.zipcode}
                    houseId={item.id}
                    imageUrl={item.image_url}
                    onDeleteHouse={() => handleDeleteHouse(item.id)}
                  />
                )}
                scrollEnabled={false}
              />
            )}
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
    padding: '5%',
    marginTop: 20,
  },
  titleContainer: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: colors.principalBlue,
    borderRadius: 15,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
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
  addButtom: {
    width: '35%',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colors.darkGreen
  },
  textButtom: {
    color: 'white',
    justifyContent: 'center',
    fontSize: 18,
  }
})