import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export interface UserData {
  publicTag?: string;
  email?: string;
  displayName?: string;
  createdAt?: any;
  lastLoginAt?: any;
  isActive?: boolean;
  tagLastChanged?: any;
  role?: string;
}

export class UserService {
  // Get user by ID
  static async getUserById(userId: string): Promise<UserData | null> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }

      return null;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      throw error;
    }
  }

  // Ensure user document exists
  static async ensureUserDocument(
    userId: string,
    userEmail?: string,
    userDisplayName?: string
  ): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userRef, {
          email: userEmail,
          displayName: userDisplayName,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          isActive: true,
          role: "user",
        });
      } else {
        // Update existing user document
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          email: userEmail || userDoc.data().email,
          displayName: userDisplayName || userDoc.data().displayName,
        });
      }
    } catch (error) {
      console.error("Error ensuring user document:", error);
      throw error;
    }
  }

  // Update user tag
  static async updateUserTag(
    userId: string,
    publicTag: string,
    userEmail?: string,
    userDisplayName?: string
  ): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, {
        publicTag,
        tagLastChanged: serverTimestamp(),
        email: userEmail,
        displayName: userDisplayName,
        lastLoginAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating user tag:", error);
      throw error;
    }
  }

  // Update user preferences
  static async updateUserPreferences(
    userId: string,
    preferences: any
  ): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        preferences,
        lastLoginAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating user preferences:", error);
      throw error;
    }
  }

  // Get user preferences
  static async getUserPreferences(userId: string): Promise<any> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data().preferences || {};
      }

      return {};
    } catch (error) {
      console.error("Error getting user preferences:", error);
      throw error;
    }
  }

  // Deactivate account
  static async deactivateAccount(userId: string): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        isActive: false,
        deactivatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error deactivating account:", error);
      throw error;
    }
  }

  // Reactivate account
  static async reactivateAccount(userId: string): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        isActive: true,
        reactivatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error reactivating account:", error);
      throw error;
    }
  }

  // Check account status
  static async checkAccountStatus(
    userId: string
  ): Promise<{ exists: boolean; isActive: boolean }> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          exists: true,
          isActive: userData.isActive !== false, // Default to true if not explicitly set to false
        };
      }

      return { exists: false, isActive: true };
    } catch (error) {
      console.error("Error checking account status:", error);
      throw error;
    }
  }
}
