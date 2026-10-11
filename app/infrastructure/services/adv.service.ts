import type { AdItem, AdsResponse, ServiceResponse } from '../../domain';
import { handleApiError } from '../../shared';
import { api } from '../config/axios.config';

export class AdvService {
  static async getAdvertising(): Promise<ServiceResponse<AdItem[]>> {
    try {
      const response = await api.get<AdsResponse>('/api/advertising');

      if (
        response.data?.success !== true ||
        !Array.isArray(response.data.data)
      ) {
        return {
          success: false,
          message: 'Unable to load advertising. Please try again.',
        };
      }

      return { success: true, data: response.data.data };
    } catch (error: unknown) {
      return handleApiError(
        error,
        'Unable to load advertising. Check your connection and try again.',
      );
    }
  }
}
