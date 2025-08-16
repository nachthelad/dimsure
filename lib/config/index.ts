// Environment configuration
export const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
} as const;

// Firebase configuration
export const FIREBASE_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
} as const;

// App constants
export const APP_CONSTANTS = {
  ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@dimsure.com",
  DEBUG_AUTHORIZED_EMAIL:
    process.env.NEXT_PUBLIC_DEBUG_AUTHORIZED_EMAIL || "debug@dimsure.com",
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  MAX_IMAGES_PER_PRODUCT: 10,
  MAX_PRODUCT_NAME_LENGTH: 100,
  MAX_SKU_LENGTH: 50,
  MIN_PRODUCT_NAME_LENGTH: 3,
  MIN_SKU_LENGTH: 2,
} as const;

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// SEO configuration
export const SEO_CONFIG = {
  DEFAULT_TITLE: "DimSure — Measure it once. Trust it forever.",
  DEFAULT_DESCRIPTION:
    "The most accurate product dimensions database. Find exact measurements for any product.",
  DEFAULT_KEYWORDS: [
    "product dimensions",
    "measurements",
    "size guide",
    "product specs",
  ],
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://dimsure.com",
  OG_IMAGE: "/og-image.jpg",
} as const;

// Analytics configuration
export const ANALYTICS_CONFIG = {
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID || "G-KY8VFRM514",
  GOOGLE_ADSENSE_ID:
    process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-1027418154196814",
  GOOGLE_ADS_CONVERSION_ID:
    process.env.NEXT_PUBLIC_ADS_CONVERSION_ID || "AW-980303157",
} as const;

// Validation configuration
export const VALIDATION_CONFIG = {
  PRODUCT: {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 100,
    SKU_MIN_LENGTH: 2,
    SKU_MAX_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 1000,
  },
  USER: {
    TAG_MIN_LENGTH: 3,
    TAG_MAX_LENGTH: 20,
    TAG_CHANGE_COOLDOWN_DAYS: 30,
  },
  DISPUTE: {
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 2000,
    EVIDENCE_MAX_LENGTH: 1000,
  },
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  PRODUCT_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  USER_CACHE_TTL: 10 * 60 * 1000, // 10 minutes
  SEARCH_CACHE_TTL: 2 * 60 * 1000, // 2 minutes
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_IMAGE_MODERATION:
    process.env.NEXT_PUBLIC_ENABLE_IMAGE_MODERATION === "true",
  ENABLE_COMMENTS: process.env.NEXT_PUBLIC_ENABLE_COMMENTS !== "false",
  ENABLE_DISPUTES: process.env.NEXT_PUBLIC_ENABLE_DISPUTES !== "false",
  ENABLE_NOTIFICATIONS:
    process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== "false",
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "false",
  ENABLE_ADSENSE: process.env.NEXT_PUBLIC_ENABLE_ADSENSE === "true",
} as const;

// Export all configurations
export const CONFIG = {
  ENV: ENV_CONFIG,
  FIREBASE: FIREBASE_CONFIG,
  APP: APP_CONSTANTS,
  API: API_CONFIG,
  SEO: SEO_CONFIG,
  ANALYTICS: ANALYTICS_CONFIG,
  VALIDATION: VALIDATION_CONFIG,
  CACHE: CACHE_CONFIG,
  FEATURES: FEATURE_FLAGS,
} as const;
