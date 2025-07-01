"use client"

import React, { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Clock, User, Edit, Package, MessageCircle, Share2, Flag, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DimensionCard } from "@/components/dimension-card"
import { DisputeModal } from "@/components/dispute-modal"
import { getProduct, incrementProductViews, likeProduct, unlikeProduct, getUserById } from "@/lib/firestore"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/components/language-provider"
import type { Product } from "@/lib/types"
import { normalizeProduct } from "@/lib/product-normalizer"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import ProductTabs from "@/components/product-tabs"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ sku: string }>
}) {
  const resolvedParams = React.use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isLiking, setIsLiking] = useState(false)
  const [createdByUser, setCreatedByUser] = useState<any>(null)
  const [lastModifiedByUser, setLastModifiedByUser] = useState<any>(null)
  const { user, isLoggedIn } = useAuth()
  const { t, locale } = useLanguage()

  const [mainImageSrc, setMainImageSrc] = useState<string | null>(null)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [categoryTranslation, setCategoryTranslation] = useState<string | null>(null)

  // Dispute modal state
  const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false)
  const [disputeInitialData, setDisputeInitialData] = useState<any>(null)

  const handleGalleryImageClick = (imageUrl: string) => {
    setMainImageSrc(imageUrl)
  }

  const handleShare = async () => {
    try {
      const url = window.location.href
      await navigator.clipboard.writeText(url)
      setShareSuccess(true)
      setTimeout(() => setShareSuccess(false), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setShareSuccess(true)
      setTimeout(() => setShareSuccess(false), 2000)
    }
  }

  const handleSuggestDifferent = () => {
    if (!isLoggedIn) {
      alert("Please sign in to suggest corrections")
      return
    }
    
    // Prepare initial data for the dispute modal
    const initialData = {
      title: `Suggested correction for ${product?.name || 'product'}`,
      productSku: product?.sku || "",
      product: product, // Pass the full product object
      disputeType: 'measurement' as const
    }
    
    setDisputeInitialData(initialData)
    setIsDisputeDialogOpen(true)
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(resolvedParams.sku)
        if (productData) {
          const normalizedProduct = normalizeProduct(productData)
          setProduct(normalizedProduct)
          setMainImageSrc(normalizedProduct.mainImage || null)
          setLikesCount(productData.likes || 0)

          // Check if user liked this product
          if (user && productData.likedBy) {
            setIsLiked(productData.likedBy.includes(user.uid))
          }

          // Fetch user data for created by and last modified by
          if (productData.createdBy) {
            const createdUser = await getUserById(productData.createdBy)
            setCreatedByUser(createdUser)
          }

          if (productData.lastModifiedBy && productData.lastModifiedBy !== productData.createdBy) {
            const modifiedUser = await getUserById(productData.lastModifiedBy)
            setLastModifiedByUser(modifiedUser)
          }

          // Increment views solo si está logueado
          if (isLoggedIn && user) {
            await incrementProductViews(resolvedParams.sku)
          }
        } else {
          notFound()
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [resolvedParams.sku, user, isLoggedIn])

  useEffect(() => {
    async function fetchCategoryTranslation() {
      if (!product?.category) return;
      const q = query(collection(db, "categories"), where("name", "==", product.category));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setCategoryTranslation(data.translations?.[locale] || data.name);
      } else {
        setCategoryTranslation(product.category);
      }
    }
    fetchCategoryTranslation();
  }, [product?.category, locale]);

  const handleLike = async () => {
    if (!isLoggedIn || !user || !product) {
      alert("Please sign in to like products")
      return
    }

    setIsLiking(true)

    try {
      if (isLiked) {
        await unlikeProduct(user.uid, product.sku)
        setIsLiked(false)
        setLikesCount((prev) => prev - 1)
      } else {
        await likeProduct(user.uid, product.sku)
        setIsLiked(true)
        setLikesCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <span>{t("navigation.home")}</span>
        <span>/</span>
        <span>{categoryTranslation || product.category}</span>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="w-full h-[400px] bg-muted dark:bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                  src={mainImageSrc || "/placeholder.svg?height=400&width=400&text=Product+Image"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="max-w-full max-h-full object-contain"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((img: string, index: number) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:ring-2 hover:ring-primary"
                  onClick={() => handleGalleryImageClick(img)}
                >
                  <CardContent className="p-2">
                    <div className="w-full h-[100px] bg-muted dark:bg-muted/50 rounded overflow-hidden flex items-center justify-center">
                      <Image
                        src={img || "/placeholder.svg?height=100&width=100&text=Image"}
                        alt={`${product.name} view ${index + 1}`}
                        width={100}
                        height={100}
                        className="max-w-full max-h-full object-contain"
                        style={{ width: "auto", height: "auto" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.brand}</Badge>
              <Badge variant="secondary">{categoryTranslation || product.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-lg font-mono text-primary mb-4">SKU: {product.sku}</p>

            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-muted-foreground"}`}
                onClick={handleLike}
                disabled={isLiking}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span>
                  {likesCount} {t("product.details.likes")}
                </span>
              </Button>
              <Badge
                variant={product.confidence && product.confidence >= 90 ? "default" : "secondary"}
                className="bg-primary/10 text-primary border-primary/20"
              >
                {product.confidence !== undefined ? `${product.confidence}%` : "N/A"} {t("product.details.confidence")}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                {product.views || 0} {t("product.details.views")}
              </Badge>
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>
          </div>

          {/* Submission Info - Solo mostrar si está logueado */}
          {isLoggedIn && (
            <>
              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>
                    {t("product.details.submittedBy")}:{" "}
                    <strong className="text-foreground">
                      {createdByUser?.publicTag || createdByUser?.displayName || "@unknown"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {t("product.details.lastModified")}:{" "}
                    <strong className="text-foreground">
                      {lastModifiedByUser?.publicTag ||
                        lastModifiedByUser?.displayName ||
                        createdByUser?.publicTag ||
                        createdByUser?.displayName ||
                        "@unknown"}
                    </strong>
                  </span>
                  {product.lastModified && <span>{new Date(product.lastModified.toDate()).toLocaleDateString()}</span>}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Main Dimensions */}
          <DimensionCard dimensions={product.primaryDimensions} title={t("product.details.verifiedDimensions")} isPrimary={true} />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="flex items-center gap-2"
              onClick={handleLike}
              disabled={isLiking}
              variant={isLiked ? "default" : "outline"}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              {isLiked ? t("product.actions.liked") : t("product.actions.like")}
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleSuggestDifferent}>
              <Edit className="h-4 w-4" />
              {t("product.actions.suggestDifferent")}
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              {shareSuccess ? t("product.actions.copied") : t("product.actions.share")}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              {t("product.actions.reportIssue")}
            </Button>
          </div>
        </div>
      </div>

      <DisputeModal
        isOpen={isDisputeDialogOpen}
        onOpenChange={setIsDisputeDialogOpen}
        initialData={disputeInitialData}
        mode="suggest"
      />

      <ProductTabs
        product={product}
        createdByUser={createdByUser}
        lastModifiedByUser={lastModifiedByUser}
        t={t}
      />
    </div>
  )
}
