export interface AuthUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isLoggedIn: boolean;
}

export interface AccountStatus {
  isActive: boolean;
  needsReactivation: boolean;
}

export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  language?: "en" | "es";
  units?: "metric" | "imperial";
}

export interface UserProfile extends AuthUser {
  publicTag?: string;
  reputation: number;
  contributionsCount: number;
  isVerified: boolean;
  preferences: UserPreferences;
}
