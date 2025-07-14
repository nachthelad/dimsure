"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCheck, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function AccountReactivation() {
  const { accountStatus, handleReactivateAccount } = useAuth()
  const [isReactivating, setIsReactivating] = useState(false)

  if (!accountStatus.needsReactivation) return null

  const handleReactivate = async () => {
    setIsReactivating(true)
    try {
      const success = await handleReactivateAccount()
      if (success) {
        // Account reactivated successfully
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to reactivate account:", error)
    } finally {
      setIsReactivating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <UserCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Welcome Back!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your account was previously deactivated. Would you like to reactivate it to continue using Dimsure?
          </p>

          <div className="space-y-3">
            <Button onClick={handleReactivate} disabled={isReactivating} className="w-full">
              {isReactivating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Reactivating...
                </>
              ) : (
                "Reactivate Account"
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              Your previous contributions and data are still safe and will be restored.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
