"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Scale, Users, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"

export default function DisputesPage() {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login?redirect=/disputes")
    }
  }, [isLoggedIn, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Community Disputes</h1>
        <p className="text-xl text-muted-foreground">Help resolve measurement disagreements and improve data quality</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">We're developing a comprehensive dispute resolution system featuring:</p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <Scale className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Fair Moderation</h3>
              <p className="text-xs text-muted-foreground mt-1">Community-driven dispute resolution</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Discussion Threads</h3>
              <p className="text-xs text-muted-foreground mt-1">Structured conversations about measurements</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Expert Review</h3>
              <p className="text-xs text-muted-foreground mt-1">Trusted contributors help resolve conflicts</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Our goal is to maintain the highest data quality through transparent community collaboration.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
