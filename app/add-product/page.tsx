"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/components/layout/language-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { AddProductForm } from "@/components/features/add-product-form"

export default function AddProductPage() {
  const { isLoggedIn, userData, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login?redirect=/add-product")
    }
  }, [isLoggedIn, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        {/* Form Skeleton */}
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  const displayName = userData?.publicTag || userData?.displayName || userData?.email || "@newuser"

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t("addProduct.title")}</h1>
        <p className="text-muted-foreground">{t("addProduct.subtitle")}</p>
      </div>

      {/* User Info */}
      <Alert className="mb-6">
        <Package className="h-4 w-4" />
        <AlertDescription>
          <p className="text-sm">
            <strong>{t("addProduct.form.submittedBy")}</strong> {displayName}
          </p>
        </AlertDescription>
      </Alert>

      <AddProductForm />
    </div>
  )
}
