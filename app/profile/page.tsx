"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/components/layout/language-provider";
import { updateUserTag } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import { UnitToggle } from "@/components/features/unit-toggle";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "@/components/features/language-toggle";
import { signOut } from "@/lib/auth";

export default function ProfilePage() {
  const { user, userData, isLoggedIn, loading } = useAuth();
  const { t } = useLanguage();

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usernameLocked, setUsernameLocked] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Update username when userData changes
  useEffect(() => {
    if (userData?.publicTag) {
      setUsername(userData.publicTag.replace("@", ""));
    } else if (user?.displayName) {
      setUsername(user.displayName.toLowerCase().replace(/\s+/g, ""));
    }
  }, [userData?.publicTag, user?.displayName]);

  useEffect(() => {
    // Si nunca se cambió el username, permitir el cambio
    if (!userData?.tagLastChanged) {
      setUsernameLocked(false);
      setDaysLeft(null);
      return;
    }
    // tagLastChanged puede ser Timestamp de Firestore
    let lastChangedDate: Date;
    if (userData.tagLastChanged instanceof Date) {
      lastChangedDate = userData.tagLastChanged;
    } else if (userData.tagLastChanged?.toDate) {
      lastChangedDate = userData.tagLastChanged.toDate();
    } else {
      lastChangedDate = new Date(userData.tagLastChanged);
    }
    const now = new Date();
    const diffMs = now.getTime() - lastChangedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 30) {
      setUsernameLocked(true);
      setDaysLeft(30 - diffDays);
    } else {
      setUsernameLocked(false);
      setDaysLeft(null);
    }
  }, [userData?.tagLastChanged]);

  useEffect(() => {
    if (!loading && (!isLoggedIn || !user)) {
      router.push("/");
    }
  }, [isLoggedIn, user, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (!username.trim()) {
      setError(t("auth.profile.errors.required"));
      return;
    }
    if (username.length < 3) {
      setError(t("auth.profile.errors.tooShort"));
      return;
    }
    if (username.length > 20) {
      setError(t("auth.profile.errors.tooLong"));
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError(t("auth.profile.errors.invalidChars"));
      return;
    }
    setIsLoading(true);
    try {
      const newTag = `@${username.toLowerCase()}`;
      await updateUserTag(
        user.uid,
        newTag,
        user?.email || undefined,
        user?.displayName || undefined
      );
      setSuccess(t("auth.profile.save"));
      setUsernameLocked(true);
      setTimeout(() => router.push("/"), 800);
    } catch (error: any) {
      setError(
        t("auth.profile.errors.updateFailed", {
          error: error.message || "Unknown error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/");
    } catch (error: any) {
      console.error("Error signing out:", error);
      setError(t("auth.signOutError"));
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.profile.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 mb-6">
            <Avatar>
              <AvatarImage
                src={user.photoURL || undefined}
                alt={user.displayName || "User"}
              />
              <AvatarFallback>
                {user.displayName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="username">{t("auth.profile.username")}</Label>
              <div className="flex items-center gap-1 w-full">
                <span className="text-muted-foreground">@</span>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    usernameLocked
                      ? userData?.publicTag?.replace("@", "") || ""
                      : t("auth.profile.placeholder")
                  }
                  className="flex-1"
                  maxLength={20}
                  disabled={usernameLocked}
                />
                <Button
                  onClick={handleSave}
                  disabled={isLoading || usernameLocked}
                  className="ml-2"
                >
                  {isLoading
                    ? t("auth.profile.saving")
                    : usernameLocked
                    ? t("auth.profile.saved")
                    : t("auth.profile.save")}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {usernameLocked
                  ? daysLeft !== null &&
                    daysLeft > 0 && (
                      <span>
                        {t("auth.profile.daysLeft", { days: daysLeft })}
                      </span>
                    )
                  : t("auth.profile.requirements")}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <Label>{t("auth.userMenu.units")}</Label>
              <UnitToggle />
            </div>
            <div className="flex flex-col items-center gap-2 w-full mt-4">
              <Label>{t("auth.userMenu.language") || "Idioma"}</Label>
              <LanguageToggle />
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-950/20 p-2 rounded mb-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-600 text-center bg-green-50 dark:bg-green-950/20 p-2 rounded mb-2">
              {success}
            </div>
          )}

          {/* Sign Out Button */}
          <Separator className="my-6" />
          <div className="flex justify-center">
            <Button
              variant="destructive"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isSigningOut ? t("auth.signingOut") : t("auth.userMenu.signOut")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
