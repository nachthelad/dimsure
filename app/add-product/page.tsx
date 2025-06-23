"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, Package, CheckCircle, Lightbulb, AlertCircle, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUnit } from "@/components/unit-provider"
import { useAuth } from "@/hooks/useAuth"
import { createProduct } from "@/lib/firestore"
import { uploadProductImage, validateImageFile } from "@/lib/storage"
import { normalizeProductName, normalizeBrandName, validateProductName } from "@/lib/product-normalizer"
import { useLanguage } from "@/components/language-provider"
import { toast } from "@/hooks/use-toast"

export default function AddProductPage() {
  const { isLoggedIn, userData, loading, user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const { unit } = useUnit()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [nameSuggestion, setNameSuggestion] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "",
    description: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    image: null as File | null,
  })

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login?redirect=/add-product")
    }
  }, [isLoggedIn, loading, router])

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate the image
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        toast({
          title: t("addProduct.form.imageError"),
          description: validation.error,
          variant: "destructive",
        })
        return
      }

      setFormData((prev) => ({ ...prev, image: file }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    setImagePreview("")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Validate user is logged in
      if (!user?.uid) {
        throw new Error(t("addProduct.validation.loginRequired"))
      }

      let imageUrl = "/placeholder.svg?height=400&width=400"

      // Upload image if provided
      if (formData.image) {
        setIsUploadingImage(true)
        try {
          imageUrl = await uploadProductImage(formData.image, formData.sku.toUpperCase())
          toast({
            title: t("addProduct.form.imageUploaded"),
            description: t("addProduct.form.imageUploadedDesc"),
          })
        } catch (imageError) {
          console.error("Image upload failed:", imageError)
          toast({
            title: t("addProduct.form.imageUploadFailed"),
            description: t("addProduct.form.imageUploadFailedDesc"),
            variant: "destructive",
          })
          // Continue without image
        } finally {
          setIsUploadingImage(false)
        }
      }

      // Validar y normalizar el nombre aquí
      const validation = validateProductName(formData.name)
      let finalName = formData.name
      if (validation.suggestion && validation.suggestion !== formData.name) {
        finalName = validation.suggestion
      }

      const productData = {
        name: normalizeProductName(finalName),
        sku: formData.sku.toUpperCase(),
        brand: normalizeBrandName(formData.brand),
        category: formData.category,
        description: formData.description,
        primaryDimensions: {
          length: Number.parseFloat(formData.length),
          width: Number.parseFloat(formData.width),
          height: Number.parseFloat(formData.height),
          unit: "mm",
        },
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
        images: imageUrl !== "/placeholder.svg?height=400&width=400" ? [imageUrl] : [],
        mainImage: imageUrl,
        specifications: {
          weight: formData.weight ? `${formData.weight}g` : "Not specified",
        },
      }

      const createdSku = await createProduct(productData, user.uid)

      setIsSuccess(true)
      toast({
        title: t("addProduct.success.title"),
        description: t("addProduct.success.message"),
      })

      // Redirect to product page after 2 seconds
      setTimeout(() => {
        router.push(`/product/${createdSku}`)
      }, 2000)
    } catch (error: any) {
      console.error("Error creating product:", error)
      setError(error.message || t("common.error"))
      toast({
        title: t("common.error"),
        description: error.message || t("common.error"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsUploadingImage(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">{t("addProduct.success.title")}</h2>
            <p className="text-muted-foreground mb-4">{t("addProduct.success.message")}</p>
            <p className="text-sm text-muted-foreground">{t("addProduct.success.redirecting")}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const displayName = userData?.publicTag || user?.displayName || user?.email || "@newuser"

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t("addProduct.title")}</h1>
        <p className="text-muted-foreground">{t("addProduct.subtitle")}</p>
      </div>

      {/* User Info - Clean version */}
      <Alert className="mb-6">
        <Package className="h-4 w-4" />
        <AlertDescription>
          <p className="text-sm">
            <strong>{t("addProduct.form.submittedBy")}</strong> {displayName}
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t("addProduct.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("addProduct.form.productName")} *</Label>
              <Input
                id="name"
                type="text"
                placeholder={t("addProduct.form.productNamePlaceholder")}
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">{t("addProduct.form.productNameHelp")}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">{t("addProduct.form.brand")} *</Label>
              <Input
                id="brand"
                type="text"
                placeholder={t("addProduct.form.brandPlaceholder")}
                value={formData.brand}
                onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">{t("addProduct.form.sku")} *</Label>
                <Input
                  id="sku"
                  type="text"
                  placeholder={t("addProduct.form.skuPlaceholder")}
                  value={formData.sku}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t("addProduct.form.category")} *</Label>
                <Input
                  id="category"
                  type="text"
                  placeholder={t("addProduct.form.categoryPlaceholder")}
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("addProduct.form.description")}</Label>
              <Textarea
                id="description"
                placeholder={t("addProduct.form.descriptionPlaceholder")}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>
                  {t("addProduct.form.boxDimensions")} * {t("addProduct.form.inMillimeters")}
                </Label>
                <Badge variant="secondary">mm</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">{t("addProduct.form.length")}</Label>
                  <Input
                    id="length"
                    type="number"
                    step="1"
                    placeholder="0"
                    value={formData.length}
                    onChange={(e) => setFormData((prev) => ({ ...prev, length: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">{t("addProduct.form.width")}</Label>
                  <Input
                    id="width"
                    type="number"
                    step="1"
                    placeholder="0"
                    value={formData.width}
                    onChange={(e) => setFormData((prev) => ({ ...prev, width: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">{t("addProduct.form.height")}</Label>
                  <Input
                    id="height"
                    type="number"
                    step="1"
                    placeholder="0"
                    value={formData.height}
                    onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">{t("addProduct.form.packageWeight")}</Label>
              <Input
                id="weight"
                type="number"
                placeholder={t("addProduct.form.weightPlaceholder")}
                value={formData.weight}
                onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
              />
            </div>

            {/* Enhanced Image Upload Section */}
            <div className="space-y-4">
              <Label htmlFor="image">{t("addProduct.form.productImage")}</Label>

              {!imagePreview ? (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{t("addProduct.form.imageUpload")}</p>
                    <p className="text-xs text-muted-foreground">{t("addProduct.form.imageFormats")}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t("addProduct.form.imageSize")}</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={removeImage}
                          disabled={isUploadingImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <ImageIcon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{formData.image?.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formData.image && `${(formData.image.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {t("addProduct.form.imageReady")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>{t("addProduct.form.submittedBy")}</strong> {displayName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{t("addProduct.form.attribution")}</p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || isUploadingImage}>
              {isUploadingImage
                ? t("addProduct.form.uploadingImage")
                : isSubmitting
                  ? t("addProduct.form.submitting")
                  : t("addProduct.form.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
