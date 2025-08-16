export interface UserData {
  uid: string;
  email?: string;
  displayName?: string;
  publicTag?: string;
  createdAt?: any;
  lastLogin?: any;
  role?: "admin" | "user";
  reputation: number;
  contributionsCount: number;
  isVerified: boolean;
  isActive: boolean;
  preferences: Record<string, any>;
  tagLastChanged?: any;
  lastUpdated?: any;
  deactivatedAt?: any;
  reactivatedAt?: any;
}

export interface AccountStatus {
  exists: boolean;
  isActive: boolean;
  userData: UserData | null;
}
