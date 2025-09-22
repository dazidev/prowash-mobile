import axios from "axios"
import { api } from "./axiosConfig"
import { UserBasicResponseInterface, UserHouseResponseItem, UserHousesResponse } from "../interfaces/user/user.interface"
import { Asset } from "react-native-image-picker"


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

  static async changeUserPassword (id: string, currentPassword: string, newPassword: string, repeatNewPassword: string): Promise<UserBasicResponseInterface> {
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

  static async deleteUserHouse (userId: string, houseId: string): Promise<UserBasicResponseInterface> {
    try {
      const response = await api.delete(`/api/user/${userId}/house/${houseId}`)
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

  static async uploadHousePhoto (image: Asset, houseId: string, userId: string): Promise<any> { // tipiar la respuesta
    // TODO: manejar las notificaciones de success o error a nivel global de la app

    if (!image.uri || !image.fileSize || !image.type) return {}

    const ext = (image.fileName?.split('.').pop() ?? 'jpg').toLowerCase()

    const jsonInfo = {
      mime: image.type,
      ext,
      size: image.fileSize
    }

    let signRes

    try {
      signRes = await api.post(`/api/user/${userId}/uploads/sign`, jsonInfo)
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) return error.response.data
      return {  success: false, error: 'NETWORK_ERROR' }
    }

    const { uploadUrl, key } = signRes.data

    const imageData = await fetch(image.uri).then(res => res.blob())
    
    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": image.type },
      body: imageData
    })

    try {
      const attach = await api.post(`/api/user/houses/${houseId}/photo/attach`, { key })
      return attach.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) return error.response.data
      return { success: false, error: 'NETWORK_ERROR' }
    }
  }



}