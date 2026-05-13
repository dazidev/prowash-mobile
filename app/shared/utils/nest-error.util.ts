import axios from 'axios';
import { ApiErrorResult, NestErrorResponse } from '../../domain';

export const isNestErrorResponse = (
  data: unknown,
): data is NestErrorResponse => {
  if (typeof data !== 'object' || data === null) return false;

  const value = data as Record<string, unknown>;

  return (
    'message' in value &&
    (typeof value.message === 'string' || Array.isArray(value.message)) &&
    typeof value.error === 'string' &&
    typeof value.statusCode === 'number'
  );
};

export const getNestErrorMessage = (message: string | string[]): string => {
  return Array.isArray(message) ? message[0] ?? 'Unexpected error' : message;
};

export const handleApiError = (
  error: unknown,
  defaultMessage = 'Unable to connect. Please try again later.',
): ApiErrorResult => {
  if (axios.isAxiosError(error) && error.response) {
    const data = error.response.data;

    if (isNestErrorResponse(data)) {
      return {
        success: false,
        message: getNestErrorMessage(data.message),
        statusCode: data.statusCode,
      };
    }
  }

  return {
    success: false,
    message: defaultMessage,
  };
};
