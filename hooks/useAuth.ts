"use client";

import { useEffect, useState } from "react";
import { type User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { UserService } from "@/lib/services/user-service";
import { UserData } from "@/lib/types/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountStatus, setAccountStatus] = useState({
    isActive: true,
    needsReactivation: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const data = await UserService.getUserById(firebaseUser.uid);
          setUserData(data);

          // Check account status
          const status = await UserService.checkAccountStatus(firebaseUser.uid);

          if (status.exists && !status.isActive) {
            // Account exists but is deactivated
            setAccountStatus({ isActive: false, needsReactivation: true });
          } else {
            // Account is active or doesn't exist yet
            setAccountStatus({ isActive: true, needsReactivation: false });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
          setAccountStatus({ isActive: true, needsReactivation: false });
        }
      } else {
        setUserData(null);
        setAccountStatus({ isActive: true, needsReactivation: false });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleReactivateAccount = async () => {
    if (user) {
      try {
        await UserService.reactivateAccount(user.uid);
        setAccountStatus({ isActive: true, needsReactivation: false });
        return true;
      } catch (error) {
        console.error("Failed to reactivate account:", error);
        return false;
      }
    }
    return false;
  };

  const isLoggedIn = !!user && accountStatus.isActive;

  return {
    user,
    userData,
    loading,
    accountStatus,
    handleReactivateAccount,
    isLoggedIn,
  };
}
