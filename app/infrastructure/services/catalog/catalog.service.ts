import { PackageResponse, ServiceResponse } from '../../../domain';
import { handleApiError } from '../../../shared';
import { api } from '../../config/axios.config';

export class CatalogService {
  static async getPackages(): Promise<ServiceResponse<PackageResponse[]>> {
    try {
      const packages = await api.get('/api/public/packages');

      return {
        success: true,
        data: packages.data,
      };
    } catch (error: unknown) {
      return handleApiError(error);
    }
  }
}
