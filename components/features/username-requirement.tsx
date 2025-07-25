"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserNameModal } from "./user-name-modal";

export function UsernameRequirement() {
  const { user, userData, loading, isLoggedIn } = useAuth();
  const [showUserNameModal, setShowUserNameModal] = useState(false);

  useEffect(() => {
    if (!loading && userData !== null) {
      if (
        isLoggedIn &&
        user &&
        (!userData.publicTag || userData.publicTag.trim() === "")
      ) {
        setShowUserNameModal(true);
      } else {
        setShowUserNameModal(false);
      }
    }
  }, [isLoggedIn, user, userData, loading]);

  if (!isLoggedIn || !user || !userData) {
    return null;
  }

  return (
    <>
      {showUserNameModal && (
        <UserNameModal
          isOpen={showUserNameModal}
          onClose={() => setShowUserNameModal(false)}
          currentTag={userData?.publicTag || null}
          userId={user.uid}
          forceModal={true}
        />
      )}
    </>
  );
}
