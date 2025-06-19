// Application constants
export const APP_CONSTANTS = {
  // Admin and contact information
  ADMIN_EMAIL: "nachthelad.dev@gmail.com",
  DEBUG_AUTHORIZED_EMAIL: "nacho.vent@gmail.com",

  // Application settings
  DEFAULT_LANGUAGE: "en",
  SUPPORTED_LANGUAGES: ["en", "es"],

  // Firestore collections
  COLLECTIONS: {
    PRODUCTS: "products",
    USERS: "users",
  },

  // UI constants
  ITEMS_PER_PAGE: 20,
  MAX_SEARCH_RESULTS: 100,
} as const
