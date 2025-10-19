import React, { useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import ButtonRegisterLogin from '../../components/ButtonRegisterLogin';
import OrSeparator from '../../components/OrSeparator';
import CheckBox from '../../components/CheckBox';
import BackgroundBubbles from '../../components/BackgroundBubbles';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useRegisterViewModel } from '../../../viewmodels/auth/RegisterViewModel';
import { AuthContext } from '../../../context/AuthContext';

type RootStackParamList = {
  Login: undefined
  Register: undefined
  EmailVerify: undefined
}

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>()
  const { setUser } = useContext(AuthContext)
  const {
    user,
    handleRegister,
    repeatPassword,
    validations,
    setValidations,
    handleValidate,
    isLoading
  } = useRegisterViewModel()

  const handleSuccessRegister = async () => {
    const success = await handleRegister()
    if (success === true) {
      setUser(user)
      navigation.navigate('EmailVerify')
    }
  }

  return (
    <>
      <BackgroundBubbles />
      <ScrollView>

        <View style={styles.container}>
          <Text style={styles.title}>{'Create Account'}</Text>
          <Text style={styles.subtitle}>{'Fill your information below'}</Text>
          <TextInput
            placeholder="Name"
            value={user.name}
            onChangeText={(value) => { handleValidate('name', value) }}
            style={styles.input}
            placeholderTextColor="#999"
          />
          {!validations.name && (
            <Text style={styles.error}>
              Name must be 2 to 30 characters long and can only contain letters, spaces, hyphens, or apostrophes.
            </Text>
          )}
          <TextInput
            placeholder="Last Name"
            value={user.lastname}
            onChangeText={(value) => { handleValidate('lastname', value) }}
            style={styles.input}
            placeholderTextColor="#999"
          />
          {!validations.lastname && (
            <Text style={styles.error}>
              Last name must be 2 to 30 characters long and can only contain letters, spaces, hyphens, or apostrophes.
            </Text>
          )}
          <TextInput
            placeholder="Email"
            value={user.email}
            onChangeText={(value) => { handleValidate('email', value) }}
            style={styles.input}
            placeholderTextColor="#999"
          />
          {!validations.email && (
            <Text style={styles.error}>
              The email you entered is not valid.
            </Text>
          )}
          <TextInput
            placeholder="Password"
            value={user.password}
            onChangeText={(value) => { handleValidate('password', value) }}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#999"
          />
          {!validations.password && (
            <Text style={styles.error}>
              The password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a symbol.
            </Text>
          )}
          <TextInput
            placeholder="Repeat password"
            value={repeatPassword}
            onChangeText={(value) => { handleValidate('samePassword', value) }}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#999"
          />
          {!validations.samePassword && (
            <Text style={styles.error}>
              Your passwords don't match. Please enter your password again to confirm it.
            </Text>
          )}
          <View style={styles.row}>
            <Text style={[styles.link, { marginRight: 4 }]}>{'I agree with'}</Text>
            <TouchableOpacity>
              <Text style={[styles.link, { color: '#c8ff01', textDecorationLine: 'underline' }]}>{'terms and conditions'}</Text>
            </TouchableOpacity>
            <CheckBox checked={validations.terms} onChange={(value) => setValidations((prev) => ({ ...prev, terms: value }))} />
          </View>
          <>
            <ButtonRegisterLogin title='Continue' color='#c8ff01' isLoading={isLoading} onPress={handleSuccessRegister} />
            {validations.error != '' && (
              <Text style={styles.error}>
                {validations.error}
              </Text>
            )}
            <OrSeparator />
            <ButtonRegisterLogin title='Log In' color='#b5d2ff' isLoading={isLoading} onPress={() => navigation.navigate('Login')} />
          </>
        </View>
      </ScrollView>
    </>
  );
};

export default RegisterScreen;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    marginTop: 80,
  },
  title: {
    fontSize: 44,
    fontFamily: 'bold',
    color: '#c8ff01',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'bold',
    color: '#e5e5e5',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 70,
    backgroundColor: '#fff',
    fontSize: 18,
    marginTop: 16,
    padding: 20,
    borderRadius: 25,
  },
  error: {
    color: '#D9363E',
    marginTop: 10,
    paddingLeft: 6,
    fontSize: 16,
  },
  success: {
    fontSize: 20,
    color: 'green',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: '#e5e5e5',
    textAlign: 'right',
    marginTop: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});