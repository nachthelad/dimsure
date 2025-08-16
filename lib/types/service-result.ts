export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string = "UNKNOWN_ERROR",
    public originalError?: Error
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export function createSuccessResult<T>(data: T): ServiceResult<T> {
  return {
    success: true,
    data,
  };
}

export function createErrorResult<T>(
  error: string,
  code?: string
): ServiceResult<T> {
  const result: ServiceResult<T> = {
    success: false,
    error,
  };

  if (code !== undefined) {
    result.code = code;
  }

  return result;
}
