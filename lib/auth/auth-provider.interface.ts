import type { User } from "firebase/auth";

export interface AuthProvider {
  signIn(): Promise<User>;
  signOut(): Promise<void>;
  getProviderName(): string;
}

export interface AuthResult {
  user: User;
  isNewUser: boolean;
}
