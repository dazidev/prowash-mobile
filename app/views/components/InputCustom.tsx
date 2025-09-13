import React, { useState } from "react"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

type Props = {
  title: string
  value: string
  onChangeText: (value: string) => void
  error?: string
  block?: boolean
  successMessage?: string
  password?: boolean
  onBlur?: () => void
}

export const InputCustom: React.FC<Props> = ({title, value, onChangeText, error, block, successMessage, password, onBlur}: Props) => {
  const [isFocused, setIsFocused] = useState(false)
  const [visible, setVisible] = useState(false)

  const verifiedField = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const onIcon = () => {
    setVisible(!visible)
  }

  return (
    <View style={styles.optionContainer}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          value={value}
          style={[
            styles.input,
            {paddingRight: password ? 50 : 15},
            isFocused ? styles.inputFocused : styles.inputBlur,
            error 
              ? styles.inputError 
              : isFocused ? styles.inputFocused : styles.inputBlur,
            block ? {backgroundColor: '#efefef', color: '#a8a6a6'} : {}
          ]}
          onFocus={ () => setIsFocused(true)}
          onBlur={ verifiedField }
          onChangeText={ onChangeText }
          autoCapitalize={password ? "none" : "words"}
          editable={!block}
          secureTextEntry={password && !visible}
          spellCheck={false}
        />
        {block && <Ionicons name={'lock-closed-outline'} size={32} color={"#c4c4c4"} style={styles.icon}/>}
        {password && (
          <TouchableOpacity onPress={onIcon}>
            <Ionicons 
              name={visible ? 'eye-off-outline' : 'eye-outline'} 
              size={32}
              color={isFocused ? "black" : "#c4c4c4"}
              style={styles.iconTouch}
            />
          </TouchableOpacity>
        )}
        
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
    right: 40,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTouch : {
    position: 'absolute',
    right: 10,
    top: -15,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  }
})