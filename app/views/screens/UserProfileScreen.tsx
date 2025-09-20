import React, { useContext } from "react"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserProfileViewModel } from "../../viewmodels/userProfile/UserProfileViewModel";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../../navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import CleaningBackground from "../components/CleaningBackground";
import { AuthContext } from "../../context/AuthContext";
import { colors } from "../../theme/colors";

const DATA = [
  {
    id: '1',
    title: 'Edit profile',
    color: 'black',
    icon: 'create-outline'
  },
  {
    id: '2',
    title: 'Membership',
    color: 'black',
    icon: 'diamond-outline'
  },
  {
    id: '3',
    title: 'Manage my houses',
    color: 'black',
    icon: 'home-outline'
  },
  {
    id: '4',
    title: 'Terms and conditions',
    color: 'black',
    icon: 'alert-circle-outline'
  },
  {
    id: '5',
    title: 'Logout',
    color: 'red',
    icon: 'log-out-outline'
  }

]

type ItemProps = {title: string, color: string, icon: string, id: string}
type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileHome'>
export const UserProfileScreen = () => {
  const { user } = useContext(AuthContext)
  const navigation = useNavigation<NavigationProp>()
  const { handleOptions } = UserProfileViewModel()

  const handlePress = (id: number) => {
    const route = handleOptions(id)
    if (route) navigation.navigate(route)
  }

  const Item = ({title, color, icon, id}: ItemProps) => (
    <>
      <TouchableOpacity style={styles.item} onPress={ () => handlePress(parseInt(id)) }>
        <View>
          <Ionicons
            name={icon}
            size={32} 
            color={color}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center', paddingLeft: 6}} >
          <Text style={{
            fontSize: 20,
            color: color,
          }}>
            {title}
          </Text>
        </View>
        <View>
          <Ionicons
            name= 'arrow-forward-outline'
            size={32} 
            color={color}
          />
        </View>
      </TouchableOpacity>
      {(parseInt(id) < 5) && (
          <View style={{
            borderBottomWidth: 1,
            marginHorizontal: 20,
            opacity: 0.7,
          }}/>
      )}
      
    </>
  )

  return (
    <View style={styles.container}>
      <CleaningBackground/>
      <View style={styles.containPhotoProfile}>
        <View style={styles.containerPhoto}>
          <Text style={styles.textPhoto}>{`${user?.name.trim().charAt(0)}${user?.lastname.trim().charAt(0)}`}</Text>
        </View>
        <Text style={styles.titleName}>
          {`${user?.name} ${user?.lastname}`}
        </Text>
      </View>
      <View style={styles.containerOptions}>
        <FlatList
          data={DATA}
          renderItem={({item}) => <Item title={item.title} color={item.color} icon={item.icon} id={item.id}/>}
          keyExtractor={item => item.id}
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  titleName: {
    paddingTop: 20,
    fontSize: 30,
    color: colors.principalWhite,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  containPhotoProfile: {
    height: '40%',
    backgroundColor: '#0D47A1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPhoto: {
    height: 140,
    width: 140,
    borderRadius: 70,
    backgroundColor: colors.darkGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textPhoto: {
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 70,
    fontSize: 80,
    fontWeight: 'bold',
    color: colors.principalWhite,
  },
  item: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderBottomColor: 'gray',
    flexDirection: 'row'
  },
  containerOptions: {
    position: 'relative',
    top: -60,
    marginHorizontal: '8%',
    backgroundColor: colors.principalWhite,
    borderRadius: 15,
  }
})