import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { ensureUserDocument } from "./firestore"
import { auth } from "./firebase"

const googleProvider = new GoogleAuthProvider()

// Add additional scopes if needed
googleProvider.addScope("email")
googleProvider.addScope("profile")

export const signInWithGoogle = async () => {
  try {
    console.log("Starting Google sign in...")

    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    console.log("User signed in successfully:", user.uid)

    // Ensure user document exists in Firestore
    await ensureUserDocument(user.uid, user.email || undefined, user.displayName || undefined)

    console.log("User document ensured in Firestore")

    return user
  } catch (error: any) {
    console.error("Error signing in with Google:", error)

    // Handle specific error cases
    if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in was cancelled")
    } else if (error.code === "auth/popup-blocked") {
      throw new Error("Pop-up was blocked by browser")
    } else if (error.code === "auth/cancelled-popup-request") {
      throw new Error("Another sign-in popup is already open")
    }

    throw error
  }
}

export const signOut = async () => {
  try {
    console.log("Signing out user...")
    await firebaseSignOut(auth)
    console.log("User signed out successfully")
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Helper function to get current user
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}
