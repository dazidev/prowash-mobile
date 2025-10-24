import React, { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  password: string,
  placeholder: string,
  setPassword: (password: string) => void;
}

export const InputPass = ({ password, placeholder, setPassword }: Props) => {
  const [visible, setVisible] = useState(true)

  const handleChange = (value: string) => {
    setPassword(value)
  }

  const handleVisible = () => {
    setVisible(!visible)
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        value={password}
        onChangeText={(value) => handleChange(value)}
        secureTextEntry={visible}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TouchableOpacity
        style={styles.iconEye}
        onPress={handleVisible}
      >
        <Ionicons
          name={visible ? 'eye-outline' : 'eye-off-outline'}
          size={32}
          color={'gray'}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    flexDirection: 'row',
  },
  input: {
    height: 70,
    width: '100%',
    backgroundColor: '#fff',
    fontSize: 18,
    marginTop: 16,
    paddingHorizontal: 20,
    paddingRight: 56, // espacio para el ojo
    borderRadius: 25,
  },
  iconEye: {
    position: 'absolute',
    top: 35,
    right: 19,
    zIndex: 10,
    elevation: 2,
  },
});
