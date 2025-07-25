export interface UserData {
  publicTag?: string;
  email?: string;
  displayName?: string;
  createdAt?: any;
  lastLoginAt?: any;
  isActive?: boolean;
  tagLastChanged?: any;
  role?: UserRole;
  preferences?: UserPreferences;
  deactivatedAt?: any;
  reactivatedAt?: any;
}

export type UserRole = "user" | "admin" | "moderator";

export interface UserPreferences {
  preferredUnitSystem?: "metric" | "imperial";
  language?: "en" | "es";
  theme?: "light" | "dark" | "system";
  notifications?: {
    email?: boolean;
    push?: boolean;
    disputes?: boolean;
    comments?: boolean;
  };
}

export interface UserStats {
  totalProducts: number;
  totalLikes: number;
  totalViews: number;
  averageConfidence: number;
  joinDate: any;
  lastActivity: any;
}

export interface UserProfile {
  id: string;
  data: UserData;
  stats: UserStats;
}
