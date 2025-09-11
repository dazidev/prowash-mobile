import React, { useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

type Props = {
  title: string
  value: string
  onChangeText: (value: string) => void
  error?: string
  block?: boolean
  successMessage?: string
}

export const InputCustom: React.FC<Props> = ({title, value, onChangeText, error, block, successMessage}: Props) => {
  const [isFocused, setIsFocused] = useState(false)

  const verifiedField = () => {
    setIsFocused(false)
  }

  return (
    <View style={styles.optionContainer}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          value={value}
          style={[
            styles.input,
            isFocused ? styles.inputFocused : styles.inputBlur,
            error 
              ? styles.inputError 
              : isFocused ? styles.inputFocused : styles.inputBlur,
            block ? {backgroundColor: '#efefef', color: '#a8a6a6'} : {}
          ]}
          onFocus={ () => setIsFocused(true)}
          onBlur={ verifiedField }
          onChangeText={ onChangeText }
          autoCapitalize="words"
          editable={!block}
        />
        {block && <Ionicons name={'lock-closed-outline'} size={32} color={"#c4c4c4"} style={styles.icon}/>}
        
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  optionContainer:{
    width: '90%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#c4c4c4",
  },
  input: {
    width: '100%',
    height: 60,
    borderColor: '#c4c4c4',
    fontSize: 18,
    paddingLeft: 15,
    paddingVertical: 0,
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 5,
    marginBottom: 2,
  },
  inputFocused: {
    borderColor: 'black',
  },
  inputBlur: {
    borderColor: '#c4c4c4',
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    fontSize: 13,
    color: 'red'
  },
  successMessage: {
    fontSize: 13,
    color: '#11bf22'
  },
  title: {
    fontSize: 15
  },
  icon : {
    marginLeft: -50
  }
})