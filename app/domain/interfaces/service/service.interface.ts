export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export type ApiErrorResult = {
  success: false;
  message: string;
  statusCode?: number;
};

export interface PackageResponse {
  id: string;
  name: string;
  services: {
    id: string;
    serviceId: string;
    name: string;
    amount: number;
  }[];
  prices: {
    id: string;
    price: number;
    name: string;
    unit: string;
  }[];
}
