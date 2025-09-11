export enum ServerErrorCode {
  INSERT_FAILED = 'INSERT_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  EMAIL_ALREADY_REGISTERED = 'EMAIL_ALREADY_REGISTERED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  CREDENTIALS_NOT_MATCH = 'CREDENTIALS_NOT_MATCH',
  TOKENS_NOT_GENERATED = 'TOKENS_NOT_GENERATED',
  TO_IS_REQUIRED = 'TO_IS_REQUIRED',
  ERROR_SENDING_EMAIL = 'ERROR_SENDING_EMAIL',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  CODE_NOT_FOUND = 'CODE_NOT_FOUND',
  CODE_EXPIRED = 'CODE_EXPIRED',
}

export const ServerErrorMessages: Record<ServerErrorCode, string> = {
  [ServerErrorCode.INSERT_FAILED]: 'INSERT_FAILED',
  [ServerErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred.',
  [ServerErrorCode.EMAIL_ALREADY_REGISTERED]: 'This email is already registered.',
  [ServerErrorCode.USER_NOT_FOUND]: 'USER_NOT_FOUND',
  [ServerErrorCode.CREDENTIALS_NOT_MATCH]: 'CREDENTIALS_NOT_MATCH',
  [ServerErrorCode.TOKENS_NOT_GENERATED]: 'TOKENS_NOT_GENERATED',
  [ServerErrorCode.TO_IS_REQUIRED]: 'The "to" field is required.',
  [ServerErrorCode.ERROR_SENDING_EMAIL]: 'An error occurred while sending the email.',
  [ServerErrorCode.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
  [ServerErrorCode.CODE_NOT_FOUND]: 'CODE_NOT_FOUND',
  [ServerErrorCode.CODE_EXPIRED]: 'CODE_EXPIRED',
}

export const getErrorUtil = (code: ServerErrorCode): string => {
  return ServerErrorMessages[code] || 'An unexpected error occurred.'
}

