"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/components/language-provider"
import { useUnit } from "@/components/unit-provider"
import { updateUserTag } from "@/lib/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { UnitToggle } from "@/components/unit-toggle"
import { useRouter } from "next/navigation"
import { Timestamp } from "firebase/firestore"

export default function ProfilePage() {
  const { user, userData, isLoggedIn, loading } = useAuth()
  const { t } = useLanguage()
  const { unit, setUnit } = useUnit()
  const router = useRouter()
  const [username, setUsername] = useState(userData?.publicTag?.replace("@", "") || user?.displayName?.toLowerCase().replace(/\s+/g, "") || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [usernameLocked, setUsernameLocked] = useState(false)
  const [daysLeft, setDaysLeft] = useState<number | null>(null)

  useEffect(() => {
    // Si nunca se cambió el username, permitir el cambio
    if (!userData?.tagLastChanged) {
      setUsernameLocked(false)
      setDaysLeft(null)
      return
    }
    // tagLastChanged puede ser Timestamp de Firestore
    let lastChangedDate: Date
    if (userData.tagLastChanged instanceof Date) {
      lastChangedDate = userData.tagLastChanged
    } else if (userData.tagLastChanged?.toDate) {
      lastChangedDate = userData.tagLastChanged.toDate()
    } else {
      lastChangedDate = new Date(userData.tagLastChanged)
    }
    const now = new Date()
    const diffMs = now.getTime() - lastChangedDate.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays < 30) {
      setUsernameLocked(true)
      setDaysLeft(30 - diffDays)
    } else {
      setUsernameLocked(false)
      setDaysLeft(null)
    }
  }, [userData?.tagLastChanged])

  useEffect(() => {
    if (!loading && (!isLoggedIn || !user)) {
      router.push("/")
    }
  }, [isLoggedIn, user, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || !user) {
    return null
  }

  const handleSave = async () => {
    setError("")
    setSuccess("")
    if (!username.trim()) {
      setError(t("auth.editUsername.errors.required"))
      return
    }
    if (username.length < 3) {
      setError(t("auth.editUsername.errors.tooShort"))
      return
    }
    if (username.length > 20) {
      setError(t("auth.editUsername.errors.tooLong"))
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError(t("auth.editUsername.errors.invalidChars"))
      return
    }
    setIsLoading(true)
    try {
      const newTag = `@${username.toLowerCase()}`
      await updateUserTag(user.uid, newTag, user?.email || undefined, user?.displayName || undefined)
      setSuccess(t("auth.editUsername.save"))
      setUsernameLocked(true)
      setTimeout(() => router.push("/"), 800)
    } catch (error: any) {
      setError(t("auth.editUsername.errors.updateFailed", { error: error.message || "Unknown error" }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{t("auth.editUsername.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6 mb-6">
            <Avatar>
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
              <AvatarFallback>{user.displayName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-sm text-muted-foreground">
              {user.email}
            </div>
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="username">{t("auth.editUsername.username")}</Label>
              <div className="flex items-center gap-1 w-full">
                <span className="text-muted-foreground">@</span>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={usernameLocked ? userData?.publicTag?.replace("@", "") || "" : t("auth.editUsername.placeholder")}
                  className="flex-1"
                  maxLength={20}
                  disabled={usernameLocked}
                />
                <Button onClick={handleSave} disabled={isLoading || usernameLocked} className="ml-2">
                  {isLoading
                    ? t("auth.editUsername.saving")
                    : usernameLocked
                      ? t("auth.editUsername.saved")
                      : t("auth.editUsername.save")}
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {usernameLocked ? (
                  daysLeft !== null && daysLeft > 0 && (
                    <span>{t("auth.editUsername.daysLeft", { days: daysLeft })}</span>
                  )
                ) : t("auth.editUsername.requirements")}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <Label>{t("auth.userMenu.units")}</Label>
              <UnitToggle />
            </div>
          </div>
          {error && <div className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-950/20 p-2 rounded mb-2">{error}</div>}
          {success && <div className="text-sm text-green-600 text-center bg-green-50 dark:bg-green-950/20 p-2 rounded mb-2">{success}</div>}
        </CardContent>
      </Card>
    </div>
  )
} 