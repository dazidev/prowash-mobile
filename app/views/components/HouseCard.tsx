import { Image, StyleSheet, Text, TouchableOpacity } from "react-native"
import { View } from "react-native"
import { colors } from "../../theme/colors"
import Ionicons from "react-native-vector-icons/Ionicons"

type Props = {
  name: string
  street: string
  complementStreet: string
  city: string
  state: string
  zipcode: string
}


const HouseCard = ({name, street, complementStreet, city, state, zipcode}: Props) => {

  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image 
          source={{uri: 'https://imgix.cosentino.com/es/wp-content/uploads/2023/07/Lumire-70-Facade-MtWaverley-vic-1.jpg?auto=format%2Ccompress&ixlib=php-3.3.0'}}
          style={styles.image}
        />
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.icon}>
            <Ionicons name={'create-outline'} size={28} color={'black'}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Ionicons name={'trash-outline'} size={28} color={'red'}/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.infoText}>{street} {complementStreet}</Text>
        <Text style={styles.infoText}>{city}, {state} {zipcode}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 280,
    backgroundColor: colors.bgInactive,
    borderRadius: 15,
    marginBottom: '5%',
  },
  imageContainer: {
    height: 160,
    borderRadius: 15,
  },
  infoContainer: {
    padding: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  infoText: {
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  iconsContainer: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    margin: 5,
  },
  icon: {
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
})

export default HouseCard