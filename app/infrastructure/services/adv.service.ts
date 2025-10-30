import axios from "axios"
import { api } from "../config/axios.config"

export class AdvService {

  static async getAdvertising() {
    try {
      const response = await api.get('/api/advertising')
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
}