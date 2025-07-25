import { CONFIG } from "@/lib/config";

export class ValidationUtils {
  // Product validation
  static validateProductName(name: string): {
    isValid: boolean;
    error?: string;
  } {
    if (!name.trim()) {
      return { isValid: false, error: "Product name is required" };
    }

    if (name.trim().length < CONFIG.VALIDATION.PRODUCT.NAME_MIN_LENGTH) {
      return {
        isValid: false,
        error: `Product name must be at least ${CONFIG.VALIDATION.PRODUCT.NAME_MIN_LENGTH} characters`,
      };
    }

    if (name.trim().length > CONFIG.VALIDATION.PRODUCT.NAME_MAX_LENGTH) {
      return {
        isValid: false,
        error: `Product name must be less than ${CONFIG.VALIDATION.PRODUCT.NAME_MAX_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  static validateSku(sku: string): { isValid: boolean; error?: string } {
    if (!sku.trim()) {
      return { isValid: false, error: "SKU is required" };
    }

    if (sku.trim().length < CONFIG.VALIDATION.PRODUCT.SKU_MIN_LENGTH) {
      return {
        isValid: false,
        error: `SKU must be at least ${CONFIG.VALIDATION.PRODUCT.SKU_MIN_LENGTH} characters`,
      };
    }

    if (sku.trim().length > CONFIG.VALIDATION.PRODUCT.SKU_MAX_LENGTH) {
      return {
        isValid: false,
        error: `SKU must be less than ${CONFIG.VALIDATION.PRODUCT.SKU_MAX_LENGTH} characters`,
      };
    }

    // Only allow alphanumeric characters, hyphens, and underscores
    const skuRegex = /^[a-zA-Z0-9_-]+$/;
    if (!skuRegex.test(sku.trim())) {
      return {
        isValid: false,
        error:
          "SKU can only contain letters, numbers, hyphens, and underscores",
      };
    }

    return { isValid: true };
  }

  static validateDimensions(
    length: number,
    width: number,
    height: number
  ): { isValid: boolean; error?: string } {
    if (length <= 0 || width <= 0 || height <= 0) {
      return {
        isValid: false,
        error: "All dimensions must be positive numbers",
      };
    }

    if (length > 10000 || width > 10000 || height > 10000) {
      return { isValid: false, error: "Dimensions cannot exceed 10,000mm" };
    }

    return { isValid: true };
  }

  // User validation
  static validateUserTag(tag: string): { isValid: boolean; error?: string } {
    if (!tag.trim()) {
      return { isValid: false, error: "Username is required" };
    }

    if (tag.trim().length < CONFIG.VALIDATION.USER.TAG_MIN_LENGTH) {
      return {
        isValid: false,
        error: `Username must be at least ${CONFIG.VALIDATION.USER.TAG_MIN_LENGTH} characters`,
      };
    }

    if (tag.trim().length > CONFIG.VALIDATION.USER.TAG_MAX_LENGTH) {
      return {
        isValid: false,
        error: `Username must be less than ${CONFIG.VALIDATION.USER.TAG_MAX_LENGTH} characters`,
      };
    }

    // Only allow alphanumeric characters and underscores
    const tagRegex = /^[a-zA-Z0-9_]+$/;
    if (!tagRegex.test(tag.trim())) {
      return {
        isValid: false,
        error: "Username can only contain letters, numbers, and underscores",
      };
    }

    return { isValid: true };
  }

  // Email validation
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }

    return { isValid: true };
  }

  // File validation
  static validateFile(
    file: File,
    options?: {
      maxSize?: number;
      allowedTypes?: string[];
    }
  ): { isValid: boolean; error?: string } {
    const maxSize = options?.maxSize || CONFIG.APP.MAX_FILE_SIZE;
    const allowedTypes =
      options?.allowedTypes || CONFIG.APP.ALLOWED_IMAGE_TYPES;

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must be less than ${Math.round(
          maxSize / 1024 / 1024
        )}MB`,
      };
    }

    if (!allowedTypes.includes(file.type as any)) {
      return {
        isValid: false,
        error: `File type must be one of: ${allowedTypes.join(", ")}`,
      };
    }

    return { isValid: true };
  }

  // URL validation
  static validateUrl(url: string): { isValid: boolean; error?: string } {
    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return { isValid: false, error: "Please enter a valid URL" };
    }
  }

  // Required field validation
  static validateRequired(
    value: any,
    fieldName: string
  ): { isValid: boolean; error?: string } {
    if (!value || (typeof value === "string" && !value.trim())) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    return { isValid: true };
  }

  // Number validation
  static validateNumber(
    value: string,
    options?: {
      min?: number;
      max?: number;
      allowDecimals?: boolean;
    }
  ): { isValid: boolean; error?: string } {
    const num = parseFloat(value);

    if (isNaN(num)) {
      return { isValid: false, error: "Please enter a valid number" };
    }

    if (options?.min !== undefined && num < options.min) {
      return { isValid: false, error: `Value must be at least ${options.min}` };
    }

    if (options?.max !== undefined && num > options.max) {
      return {
        isValid: false,
        error: `Value must be less than ${options.max}`,
      };
    }

    if (!options?.allowDecimals && !Number.isInteger(num)) {
      return { isValid: false, error: "Value must be a whole number" };
    }

    return { isValid: true };
  }
}
