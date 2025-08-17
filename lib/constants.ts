// Application constants
export const APP_CONSTANTS = {
  // Admin and contact information
  // Use NEXT_PUBLIC_* so it's available on the client
  ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
  DEBUG_AUTHORIZED_EMAIL: process.env.NEXT_PUBLIC_DEBUG_AUTHORIZED_EMAIL || "",

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
} as const;
