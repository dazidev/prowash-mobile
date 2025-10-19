import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  title:string;
  color:string;
  onPress: () => void;
}

const ButtonRegisterLogin = ({title, color, onPress}:Props) => {
  return (
    <TouchableOpacity 
      style = {[{ backgroundColor: color}, styles.button]}
       onPress = {onPress}
    >
      <Text style = {styles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

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
  }
})

export default ButtonRegisterLogin