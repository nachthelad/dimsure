import {
  signInWithPopup,
  GoogleAuthProvider as FirebaseGoogleProvider,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "../firebase";
import { UserService } from "../services/user-service";
import type { AuthProvider } from "./auth-provider.interface";

export class GoogleAuthProvider implements AuthProvider {
  private provider: FirebaseGoogleProvider;

  constructor() {
    this.provider = new FirebaseGoogleProvider();
    this.provider.addScope("email");
    this.provider.addScope("profile");
  }

  async signIn(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, this.provider);
      const user = result.user;

      // Ensure user document exists in Firestore
      await UserService.ensureUserDocument(
        user.uid,
        user.email || undefined,
        user.displayName || undefined
      );

      return user;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);

      // Handle specific error cases
      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Sign-in was cancelled");
      } else if (error.code === "auth/popup-blocked") {
        throw new Error("Pop-up was blocked by browser");
      } else if (error.code === "auth/cancelled-popup-request") {
        throw new Error("Another sign-in popup is already open");
      }

      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  getProviderName(): string {
    return "Google";
  }
}
