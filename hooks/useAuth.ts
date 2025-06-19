"use client"

import { useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { checkAccountStatus, reactivateAccount } from "@/lib/firestore"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [accountStatus, setAccountStatus] = useState<{
    isActive: boolean
    needsReactivation: boolean
  }>({ isActive: true, needsReactivation: false })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // Check account status when user signs in
        const status = await checkAccountStatus(user.uid)

        if (status.exists && !status.isActive) {
          // Account exists but is deactivated
          setAccountStatus({ isActive: false, needsReactivation: true })
        } else {
          // Account is active or doesn't exist yet
          setAccountStatus({ isActive: true, needsReactivation: false })
        }
      } else {
        setAccountStatus({ isActive: true, needsReactivation: false })
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleReactivateAccount = async () => {
    if (user) {
      try {
        await reactivateAccount(user.uid)
        setAccountStatus({ isActive: true, needsReactivation: false })
        return true
      } catch (error) {
        console.error("Failed to reactivate account:", error)
        return false
      }
    }
    return false
  }

  return {
    user,
    loading,
    accountStatus,
    handleReactivateAccount,
  }
}
