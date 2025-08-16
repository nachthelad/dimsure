export const AppConfig = {
  // Database
  database: {
    defaultProductLimit: 10,
    searchLimit: 50,
    maxImageSize: 5 * 1024 * 1024, // 5MB
  },

  // UI
  ui: {
    mobileBreakpoint: 768,
    sidebarExpandedWidth: {
      en: "xl:w-72",
      es: "xl:w-80",
    },
    defaultTheme: "dark" as const,
    defaultLanguage: "en" as const,
    defaultUnits: "metric" as const,
  },

  // Features
  features: {
    enableAnalytics: process.env.NODE_ENV === "production",
    enableNotifications: true,
    enableDisputes: true,
  },

  // Validation
  validation: {
    minProductNameLength: 3,
    maxProductNameLength: 100,
    minSkuLength: 3,
    maxSkuLength: 50,
  },

  // Auth
  auth: {
    providers: ["google"] as const,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  },
} as const;

export type AppConfigType = typeof AppConfig;
