import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LoginViewModel } from '../../../viewmodels/auth/LoginViewModel';
import { AuthContext } from '../../../context/AuthContext';
import { RootStackParamList } from '../../../../domain/interfaces/navegation/navigation.interface';

//* componentes
import { InputPass } from '../../components/auth/InputPass';
import ButtonRegisterLogin from '../../components/ButtonRegisterLogin';
import OrSeparator from '../../components/OrSeparator';
import BackgroundBubbles from '../../components/BackgroundBubbles';

//* tipiado.
import type { HandleLoginResponseInterface } from '../../../../domain';





// TODO: POSTING y LOWERCASE

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const {
    credentials,
    handleChange,
    error,
    validations,
    handleLogin,
    isLoading
  } = LoginViewModel();

  const handleButtonLogin = async () => {
    const result: HandleLoginResponseInterface = await handleLogin(credentials.email, credentials.password)
    if (result.success) {
      if (!result.emailVerified) {
        navigation.navigate('EmailVerify')
      }
    }
  }

  const handlePassword = (password: string) => {
    handleChange('password', password)
  }


  return (
    <>
      <BackgroundBubbles />
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require('../../../../../assets/loginLogo.png')}
            style={styles.image}
            resizeMode='contain'
          />
          <TextInput
            placeholder="Email"
            value={credentials.email}
            onChangeText={(value) => handleChange('email', value)}

            style={styles.input}
            placeholderTextColor="#999"
          />
          {!validations.email && (
            <Text style={styles.error}>
              The email you entered is not valid.
            </Text>
          )}
          <InputPass password={credentials.password} placeholder='Password' setPassword={handlePassword}/>
          {!validations.password && (
            <Text style={styles.error}>
              The password must be at least 8 characters long.
            </Text>
          )}
          <TouchableOpacity>
            <Text style={styles.link}>{'Forgot Password?'}</Text>
          </TouchableOpacity>
          <ButtonRegisterLogin title='Log In' color='#c8ff01' isLoading={isLoading} onPress={handleButtonLogin} />
          {!error.success && (
            <Text style={styles.error}>
              {error.message}
            </Text>
          )}
          <OrSeparator />
          <ButtonRegisterLogin title='Create an Account' color='#b5d2ff' isLoading={false} onPress={() => navigation.navigate('Register')} />
        </View>
      </ScrollView>
    </>
  );
};

export default LoginScreen;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 80,
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
  image: {
    height: height * 0.3,
    width: '100%',
    marginBottom: 10,
  },
  link: {
    color: '#fff',
    textAlign: 'right',
    marginTop: 8,
    fontSize: 16,
    marginBottom: 20,
  }
});
