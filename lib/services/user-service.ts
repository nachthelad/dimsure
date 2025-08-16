import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export class UserService {
  static async getUserById(userId: string) {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }

  static async ensureUserDocument(
    userId: string,
    userEmail?: string,
    userDisplayName?: string
  ): Promise<boolean> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: userId,
          email: userEmail || null,
          displayName: userDisplayName || null,
          publicTag: null,
          role: "user",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          reputation: 0,
          contributionsCount: 0,
          isVerified: false,
          isActive: true,
          preferences: {},
        });
        return true;
      } else {
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
        });
      }
      return false;
    } catch (error) {
      console.error("Error ensuring user document:", error);
      throw error;
    }
  }

  static async checkAccountStatus(userId: string) {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          exists: true,
          isActive: userData.isActive !== false,
          userData,
        };
      }
      return { exists: false, isActive: false, userData: null };
    } catch (error) {
      console.error("Error checking account status:", error);
      return { exists: false, isActive: false, userData: null };
    }
  }

  static async reactivateAccount(userId: string): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        isActive: true,
        reactivatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error reactivating account:", error);
      throw error;
    }
  }

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
}
