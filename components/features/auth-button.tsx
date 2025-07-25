"use client";

import { Button } from "@/components/ui/button";
import { LogOut, User, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signInWithGoogle, signOut } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useLanguage } from "@/components/layout/language-provider";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export function AuthButton() {
  const { user, loading, isLoggedIn } = useAuth();
  const { t } = useLanguage();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      toast({
        title: t("auth.signInSuccess"),
        description: t("auth.welcomeBack"),
      });
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast({
        title: t("auth.signInError"),
        description: error.message || t("auth.signInErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: t("auth.signOutSuccess"),
        description: t("auth.signOutDescription"),
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: t("auth.signOutError"),
        description: error.message || t("auth.signOutErrorDescription"),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Button disabled variant="ghost" size="sm">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (isLoggedIn && user) {
    return (
      <Button
        variant="ghost"
        className="flex items-center gap-2 p-1.5 group no-shadow hover:bg-transparent focus:bg-transparent active:bg-transparent"
        onClick={() => router.push("/profile")}
      >
        <Avatar className="transition-transform group-hover:scale-105">
          <AvatarImage
            src={user.photoURL || undefined}
            alt={user.displayName || "User"}
          />
          <AvatarFallback>
            {user.displayName?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="bg-primary text-primary-foreground"
    >
      {isSigningIn ? (
        isMobile ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Loader2 className="h-4 w-4 animate-spin" />
        )
      ) : isMobile ? (
        <>
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isSigningIn ? t("auth.signingIn") : t("navigation.signIn")}
        </>
      ) : (
        <>
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span
            className={
              "transition-all duration-200 whitespace-nowrap overflow-hidden" +
              " opacity-0 absolute ml-0" +
              " xl:group-hover:static xl:group-hover:opacity-100 xl:group-hover:ml-3 xl:sidebar-force-open:static xl:sidebar-force-open:opacity-100 xl:sidebar-force-open:ml-3"
            }
          >
            {t("navigation.signIn")}
          </span>
        </>
      )}
    </Button>
  );
}
