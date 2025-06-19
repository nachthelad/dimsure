import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyBfh1YyxXtN1LZjthySFGrno8YkhYvyjRQ",
  authDomain: "dimsure-93ebd.firebaseapp.com",
  projectId: "dimsure-93ebd",
  storageBucket: "dimsure-93ebd.firebasestorage.app",
  messagingSenderId: "669500898904",
  appId: "1:669500898904:web:47c6717c78bc777bfd942d",
  measurementId: "G-KY8VFRM514",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Analytics only on client side
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export default app
