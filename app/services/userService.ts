import axios from "axios"
import { api } from "./axiosConfig"
import { UserChangePasswordResponseInterface, UserHouseResponseItem, UserHousesResponse } from "../interfaces/user/user.interface"


export class UserService {

  static async editPersonalInfo (id: string, name: string, lastname: string) {
    try {
      const jsonInfo = {
        "name": name,
        "lastname": lastname,
      }
      const response = await api.post(`/api/user/edit/personal-info/${id}`, jsonInfo)
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

  static async changeUserPassword (id: string, currentPassword: string, newPassword: string, repeatNewPassword: string): Promise<UserChangePasswordResponseInterface> {
    try {
      const jsonInfo = {
        "currentPassword": currentPassword,
        "newPassword": newPassword,
        "repeatNewPassword": repeatNewPassword
      }
      const response = await api.post(`/api/user/change/password/${id}`, jsonInfo)
      return response.data
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data
      }
      return {
        success: false,
        error: 'NETWORK_ERROR',
      }
    }
  }

  static async getUserHouses (id: string): Promise<UserHousesResponse> {
    try {
      const response = await api.get(`/api/user/houses/${id}`)
      return response.data
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data
      }
      return {
        success: false,
        error: 'NETWORK_ERROR',
      }
    }
  }

  static async addUserHouse (house: UserHouseResponseItem) {
    try {
      const { id, name, street, complement_street, city, state, zipcode } = house
      const jsonInfo = {
        name,
        street,
        'complementStreet': complement_street,
        city,
        state,
        zipcode,
      }
      const response = await api.post(`/api/user/add/house/${id}`, jsonInfo)
      return response.data
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data
      }
      return {
        success: false,
        error: 'NETWORK_ERROR',
      }
    }
  }

}