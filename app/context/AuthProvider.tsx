import React, { PropsWithChildren, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import type { AuthStatus, IAuthTokens, IUserLoginResponse } from '../interfaces/auth/AuthInterface'
import { AuthService } from '../services/AuthService'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../interfaces/NavigationModel'

const AuthProvider = ({ children }: PropsWithChildren) => {

  const [status, setStatus] = useState<AuthStatus>('unauthenticated')
  const [tokens, setTokens] = useState<IAuthTokens | undefined>(undefined)
  const [user, setUser] = useState< IUserLoginResponse | undefined>(undefined)

  useEffect(() => {
    //AuthService.checkStatus()
  }, [])

  /*useEffect(() => {
    if (status !== 'checking'){
      if (status === 'authenticated'){
        navigation.reset({
          index: 0,
          routes: [{name: 'MainBottomTab'}]
        })
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}]
        })
      }
    }
  }, [status])*/

  return (
    <AuthContext.Provider
      value={{
        status,
        tokens,
        user,
        setStatus,
        setTokens,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider




