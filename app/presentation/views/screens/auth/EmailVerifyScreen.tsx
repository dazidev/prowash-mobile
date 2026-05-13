import React, { useContext } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import BackgroundBubbles from '../../components/BackgroundBubbles';
import { useEmailVerifyViewModel } from '../../../viewmodels/auth/EmailVerifyViewModel';
import ButtonRegisterLogin from '../../components/ButtonRegisterLogin';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import CountdownTimer from '../../components/CountdownTimer';
import { AuthContext } from '../../../context/AuthContext';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  EmailVerify: undefined;
  MainBottomTab: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EmailVerify'
>;

export const EmailVerifyScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { user } = useContext(AuthContext);
  const {
    code,
    handleValidate,
    input2,
    input3,
    input4,
    resendCode,
    setTimecode,
    timecode,
    handleConfirm,
    error,
    isLoading,
    setIsLoading,
  } = useEmailVerifyViewModel();

  const handleButtonConfirm = async () => {
    console.log(user);
    if (!user?.id) return;
    setIsLoading(true);
    const result = await handleConfirm(user.id);
    console.log(result);
    setIsLoading(false);
  };

  return (
    <>
      <BackgroundBubbles />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We've sent a code to {user?.email.toLowerCase()}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput
            placeholder="-"
            value={code.param1}
            onChangeText={value => handleValidate('param1', value, input2)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TextInput
            ref={input2}
            placeholder="-"
            value={code.param2}
            onChangeText={value => handleValidate('param2', value, input3)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TextInput
            ref={input3}
            placeholder="-"
            value={code.param3}
            onChangeText={value => handleValidate('param3', value, input4)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TextInput
            ref={input4}
            placeholder="-"
            value={code.param4}
            onChangeText={value => handleValidate('param4', value)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            disabled={timecode > 0}
            onPress={() =>
              user && resendCode(user.email, user.name, user.lastname, user.id)
            }
            style={{ opacity: timecode > 0 ? 0.5 : 1 }}
          >
            <Text style={styles.link}>RESEND CODE</Text>
          </TouchableOpacity>
          {timecode > 0 && (
            <CountdownTimer
              key={timecode}
              initialSeconds={timecode}
              onFinish={() => setTimecode(0)}
            />
          )}
        </View>
        <ButtonRegisterLogin
          title="Confirm"
          color="#c8ff01"
          isLoading={isLoading}
          onPress={handleButtonConfirm}
        />
        {error.success && <Text style={styles.error}>{error.message}</Text>}
      </View>
    </>
  );
};

export default EmailVerifyScreen;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#c8ff01',
    textAlign: 'left',
    marginTop: 100,
  },
  subtitle: {
    fontSize: 22,
    fontFamily: 'bold',
    color: '#e5e5e5',
    textAlign: 'left',
    marginBottom: 20,
    marginTop: 10,
  },
  input: {
    height: width / 5,
    width: width / 5,
    backgroundColor: '#fff',
    fontSize: 50,
    textAlign: 'center',
    borderRadius: 25,
    marginVertical: 20,
  },
  link: {
    color: '#fff',
    textAlign: 'left',
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
  },
  backText: {
    fontSize: 60,
    color: '#c8ff01',
  },
  error: {
    color: '#D9363E',
    marginTop: 10,
    paddingLeft: 6,
    fontSize: 16,
  },
});
