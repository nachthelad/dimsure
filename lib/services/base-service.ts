import type { ServiceResult } from "../types/service-result";
import {
  createSuccessResult,
  createErrorResult,
  ServiceError,
} from "../types/service-result";

export abstract class BaseService {
  protected async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    errorContext: string
  ): Promise<ServiceResult<T>> {
    try {
      const result = await operation();
      return createSuccessResult(result);
    } catch (error) {
      console.error(`${errorContext}:`, error);

      if (error instanceof ServiceError) {
        return createErrorResult(error.message, error.code);
      }

      if (error instanceof Error) {
        return createErrorResult(error.message, "OPERATION_FAILED");
      }

      return createErrorResult("An unknown error occurred", "UNKNOWN_ERROR");
    }
  }

  protected validateRequired(value: any, fieldName: string): void {
    if (!value) {
      throw new ServiceError(`${fieldName} is required`, "VALIDATION_ERROR");
    }
  }
}
