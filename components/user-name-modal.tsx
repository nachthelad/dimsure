"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { updateUserTag } from "@/lib/firestore"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "./language-provider"

interface UserNameModalProps {
  isOpen: boolean
  onClose: () => void
  currentTag?: string | null
  userId: string
}

export function UserNameModal({ isOpen, onClose, currentTag, userId }: UserNameModalProps) {
  const [username, setUsername] = useState(currentTag?.replace("@", "") || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const { t } = useLanguage()

  const handleSave = async () => {
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
    setError("")

    try {
      const newTag = `@${username.toLowerCase()}`
      await updateUserTag(userId, newTag, user?.email || undefined, user?.displayName || undefined)
      onClose()
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error: any) {
      if (error.code === "permission-denied") {
        setError(t("auth.editUsername.errors.permissionDenied"))
      } else if (error.code === "not-found") {
        setError(t("auth.editUsername.errors.notFound"))
      } else if (error.message?.includes("Missing or insufficient permissions")) {
        setError(t("auth.editUsername.errors.insufficientPermissions"))
      } else {
        setError(t("auth.editUsername.errors.updateFailed", { error: error.message || "Unknown error" }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setError("")
    setUsername(currentTag?.replace("@", "") || "")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("auth.editUsername.title")}</DialogTitle>
          <DialogDescription>{t("auth.editUsername.description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {t("auth.editUsername.username")}
            </Label>
            <div className="col-span-3 flex items-center">
              <span className="text-muted-foreground mr-1">@</span>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("auth.editUsername.placeholder")}
                className="flex-1"
                maxLength={20}
              />
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-950/20 p-2 rounded">{error}</div>
          )}
          <div className="text-xs text-muted-foreground">{t("auth.editUsername.requirements")}</div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t("auth.editUsername.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? t("auth.editUsername.saving") : t("auth.editUsername.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
