import axios from 'axios'
import { IUser } from '../interfaces/UserModel'
import { api } from './axiosConfig'
import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'

export class AuthService {
  static async registerUser (user: IUser) {
    try {
      const response = await api.post('/api/auth/register/user', user)
      console.log(response)
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
  static async sendEmailCode (email: string, name: string, lastname: string) {
    try {
      const jsonEmail = {
        "to": email,
        "name": name,
        "lastname": lastname,
      }
      const response = await api.post('/api/auth/register/verify-email', jsonEmail)
      console.log(response)
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
  static async confirmCode (email: string, code: string) {
    try {
      const jsonCode = {
        "email": email,
        "code": code
      }
      const response = await api.post('/api/auth/register/verify-email-code', jsonCode)
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
  static async confirmLogin (email: string, password: string) {
    try {
      const jsonLogin = {
        "email": email,
        "password": password
      }
      const response = await api.post('/api/auth/login/user', jsonLogin)
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


