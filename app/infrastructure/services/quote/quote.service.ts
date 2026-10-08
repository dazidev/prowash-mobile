import {
  PackageInfo,
  RespondUserQuotePayload,
  ServiceResponse,
  UserQuote,
  UserQuoteResponseUpdated,
} from '../../../domain';
import { handleApiError } from '../../../shared';
import { api } from '../../config/axios.config';

export class QuoteService {
  static async createPackageOrder(
    houseId: string,
    packageInfo: PackageInfo,
  ): Promise<ServiceResponse<undefined>> {
    try {
      const quote = await api.post(
        `/api/user/order-package/${houseId}`,
        packageInfo,
      );

      return {
        success: true,
        data: quote.data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }

  static async getQuotes(): Promise<ServiceResponse<UserQuote[]>> {
    try {
      const quote = await api.get('/api/user/quotes');

      return {
        success: true,
        data: quote.data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }

  static async respondToQuote(
    quoteId: string,
    payload: RespondUserQuotePayload,
  ): Promise<ServiceResponse<UserQuoteResponseUpdated>> {
    try {
      const response = await api.patch<UserQuoteResponseUpdated>(
        `/api/user/quotes/${quoteId}/response`,
        payload,
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }
}
