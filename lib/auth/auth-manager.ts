import type { AuthProvider } from "./auth-provider.interface";
import { GoogleAuthProvider } from "./google-auth-provider";

export class AuthManager {
  private providers: Map<string, AuthProvider> = new Map();

  constructor() {
    // Register default providers
    this.registerProvider("google", new GoogleAuthProvider());
  }

  registerProvider(name: string, provider: AuthProvider): void {
    this.providers.set(name, provider);
  }

  async signIn(providerName: string = "google") {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Auth provider '${providerName}' not found`);
    }
    return provider.signIn();
  }

  async signOut(providerName: string = "google") {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Auth provider '${providerName}' not found`);
    }
    return provider.signOut();
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

// Singleton instance
export const authManager = new AuthManager();
