import axios from 'axios'

import { api } from '../config/axios.config'

import { useContext } from 'react'
import { AuthContext } from '../../presentation'
import { UserRegisterInterface } from '../../domain'

export class AuthService {
  static async registerUser (user: UserRegisterInterface) {
    try {
      const response = await api.post('/api/auth/register/user', user)
      return response.data
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data
      }
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Unable to connect. Please try again later.',
      }
    }
  }
  static async sendEmailCode (email: string, name: string, lastname: string, userId: string) {
    try {
      const jsonEmail = {
        "email": email,
        "name": name,
        "lastname": lastname,
        "userId": userId
      }
      console.log(jsonEmail)
      const response = await api.post('/api/auth/register/verify-email', jsonEmail)
      console.log(response.data)
      return response.data
    } catch (error: any) {
      console.log(error)
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data
      }
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Unable to connect. Please try again later.',
      }
    }
  }
  static async requestNewCode (email: string) {
    try {
      const jsonEmail = {
        "email": email
      }
      const response = await api.post('/api/auth/register/new-code', jsonEmail)
      return response.data
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data
      }
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Unable to connect. Please try again later.',
      }
    }
  }
  static async confirmCode (userId: string, code: string) {
    try {
      const jsonCode = {
        "userId": userId,
        "code": code
      }
      console.log('hola')
      const response = await api.post('/api/auth/register/verify-email-code', jsonCode)
      console.log(response)
      return response.data
    } catch (error: any) {
      console.log(error)
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data
      }
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Unable to connect. Please try again later.',
      }
    }
  }
  static async confirmLogin (email: string, password: string) {
    try {
      const jsonLogin = {
        "email": email,
        "password": password
      }
      const response = await api.post('/api/auth/login/user', jsonLogin)
      console.log(response)
      return response.data
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data
      }
      console.log(error)
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Unable to connect. Please try again later.',
      }
    }
  }
  static async checkStatus () {
    const { setStatus, setTokens, setUser } = useContext(AuthContext)
    try {
      const response = await api.get('/api/auth/check-status')
      if (!response) {
        setStatus('unauthenticated')
        setTokens(undefined)
        setUser(undefined)
      }
      // TODO: AGREGAR SI HAY RESPUESTA, EL ESTADO.
    } catch (error) {
      console.log({error})
      return null
    }
  }
}


