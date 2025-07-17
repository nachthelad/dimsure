// Application constants
export const APP_CONSTANTS = {
  // Admin and contact information
  ADMIN_EMAIL: "nacho.vent@gmail.com",
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
  MAX_SEARCH_RESULTS: 10,
  // Dispute system
  MIN_DISPUTE_VOTES: 5,
} as const
