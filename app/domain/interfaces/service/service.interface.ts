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
