"use client"

import React, { useState, useEffect } from "react"
import { useRouter, notFound } from "next/navigation"
import { ArrowLeft, Save, Loader2, Package, Edit, X, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/components/language-provider"
import { getProduct, updateProductField, getAllBrands, getAllCategories, uploadProductImage, updateProductImages } from "@/lib/firestore"
import { APP_CONSTANTS } from "@/lib/constants"
import type { Product } from "@/lib/types"

export default function EditProductPage({
  params,
}: {
  params: Promise<{ sku: string }>
}) {
  const resolvedParams = React.use(params)
  const { isLoggedIn, loading, user, userData } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [brands, setBrands] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [canEdit, setCanEdit] = useState(false)
  
  // Individual field states
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [weight, setWeight] = useState("")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState(0)
  
  // Loading states for individual saves
  const [savingStates, setSavingStates] = useState<{[key: string]: boolean}>({})
  const [successStates, setSuccessStates] = useState<{[key: string]: boolean}>({})
  const [uploadingStates, setUploadingStates] = useState<{[key: number]: boolean}>({})

  const isAdmin = userData?.email === APP_CONSTANTS.ADMIN_EMAIL || userData?.email === APP_CONSTANTS.DEBUG_AUTHORIZED_EMAIL

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
    }
  }, [isLoggedIn, loading, router])

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingProduct(true)
        
        // Load product
        const productData = await getProduct(resolvedParams.sku)
        if (!productData) {
          notFound()
          return
        }
        
        setProduct(productData)
        
        // Check permissions
        const userCanEdit = isAdmin || (user && productData.createdBy === user.uid)
        setCanEdit(!!userCanEdit)
        
        if (!userCanEdit) {
          // Redirect to product view if no edit permissions
          router.push(`/product/${resolvedParams.sku}`)
          return
        }
        
        // Set form values
        setName(productData.name || "")
        setDescription(productData.description || "")
        setBrand(productData.brand || "")
        setCategory(productData.category || "")
        setWeight(productData.specifications?.weight || "")
        setLength(productData.primaryDimensions?.length?.toString() || "")
        setWidth(productData.primaryDimensions?.width?.toString() || "")
        setHeight(productData.primaryDimensions?.height?.toString() || "")
        
        // Set images array (max 3 images)
        const productImages = productData.images || []
        setImages(productImages.slice(0, 3)) // Ensure max 3 images
        
        // Find main image index
        if (productData.mainImage && productImages.includes(productData.mainImage)) {
          setMainImageIndex(productImages.indexOf(productData.mainImage))
        } else {
          setMainImageIndex(0)
        }
        
        // Load brands and categories
        const [brandsData, categoriesData] = await Promise.all([
          getAllBrands(),
          getAllCategories()
        ])
        
        setBrands(brandsData)
        setCategories(categoriesData)
        
      } catch (error) {
        console.error("Error loading product data:", error)
        notFound()
      } finally {
        setIsLoadingProduct(false)
      }
    }

    if (isLoggedIn && user) {
      loadData()
    }
  }, [resolvedParams.sku, isLoggedIn, user, isAdmin, router])

  const handleSaveField = async (field: string, value: any) => {
    if (!user || !product) return
    
    const originalField = field
    setSavingStates(prev => ({ ...prev, [originalField]: true }))
    
    try {
      let processedValue = value
      
      // Handle dimensions specially
      if (field === 'primaryDimensions') {
        processedValue = {
          length: parseFloat(length) || 0,
          width: parseFloat(width) || 0,
          height: parseFloat(height) || 0
        }
      }
      
      // Handle weight specially - store in specifications
      if (field === 'weight') {
        const currentSpecs = product.specifications || {}
        processedValue = {
          ...currentSpecs,
          weight: value
        }
        field = 'specifications' // Update the specifications field instead
      }
      
      await updateProductField(product.sku, field, processedValue, user.uid)
      
      // Update local product state
      if (originalField === 'weight') {
        // Special handling for weight - update specifications
        setProduct(prev => prev ? { 
          ...prev, 
          specifications: processedValue 
        } : null)
      } else {
        setProduct(prev => prev ? { ...prev, [field]: processedValue } : null)
      }
      
      // Show success feedback
      setSuccessStates(prev => ({ ...prev, [originalField]: true }))
      setTimeout(() => {
        setSuccessStates(prev => ({ ...prev, [originalField]: false }))
      }, 2000)
      
    } catch (error) {
      console.error(`Error saving ${originalField}:`, error)
      alert(`Failed to save ${originalField}. Please try again.`)
    } finally {
      setSavingStates(prev => ({ ...prev, [originalField]: false }))
    }
  }

  const handleSaveDimensions = async () => {
    await handleSaveField('primaryDimensions', null) // Value is processed inside handleSaveField
  }

  const handleImageUpload = async (file: File, slotIndex: number) => {
    if (!user || !product) return
    
    setUploadingStates(prev => ({ ...prev, [slotIndex]: true }))
    
    try {
      const imageUrl = await uploadProductImage(file, product.sku, slotIndex)
      
      // Update images array
      const newImages = [...images]
      newImages[slotIndex] = imageUrl
      setImages(newImages)
      
      // Save to database
      await updateProductImages(product.sku, newImages, mainImageIndex, user.uid)
      
      // Update local product state
      setProduct(prev => prev ? { 
        ...prev, 
        images: newImages,
        mainImage: newImages[mainImageIndex] || newImages[0] || ""
      } : null)
      
      // Show success feedback
      setSuccessStates(prev => ({ ...prev, [`image_${slotIndex}`]: true }))
      setTimeout(() => {
        setSuccessStates(prev => ({ ...prev, [`image_${slotIndex}`]: false }))
      }, 2000)
      
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploadingStates(prev => ({ ...prev, [slotIndex]: false }))
    }
  }

  const handleSetMainImage = async (imageIndex: number) => {
    if (!user || !product || !images[imageIndex]) return
    
    setSavingStates(prev => ({ ...prev, mainImage: true }))
    
    try {
      setMainImageIndex(imageIndex)
      await updateProductImages(product.sku, images, imageIndex, user.uid)
      
      // Update local product state
      setProduct(prev => prev ? { 
        ...prev, 
        mainImage: images[imageIndex]
      } : null)
      
      // Show success feedback
      setSuccessStates(prev => ({ ...prev, mainImage: true }))
      setTimeout(() => {
        setSuccessStates(prev => ({ ...prev, mainImage: false }))
      }, 2000)
      
    } catch (error) {
      console.error("Error setting main image:", error)
      alert("Failed to set main image. Please try again.")
    } finally {
      setSavingStates(prev => ({ ...prev, mainImage: false }))
    }
  }

  const handleRemoveImage = async (imageIndex: number) => {
    if (!user || !product) return
    
    try {
      const newImages = images.filter((_, index) => index !== imageIndex)
      setImages(newImages)
      
      // Adjust main image index if needed
      let newMainIndex = mainImageIndex
      if (mainImageIndex === imageIndex) {
        newMainIndex = 0
      } else if (mainImageIndex > imageIndex) {
        newMainIndex = mainImageIndex - 1
      }
      setMainImageIndex(newMainIndex)
      
      await updateProductImages(product.sku, newImages, newMainIndex, user.uid)
      
      // Update local product state
      setProduct(prev => prev ? { 
        ...prev, 
        images: newImages,
        mainImage: newImages[newMainIndex] || ""
      } : null)
      
    } catch (error) {
      console.error("Error removing image:", error)
      alert("Failed to remove image. Please try again.")
    }
  }

  if (loading || isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn || !canEdit) {
    return null // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/my-contributions">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("editProduct.backToContributions")}
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Edit className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">{t("editProduct.title")}</h1>
          {isAdmin && <Badge variant="destructive">{t("disputes.admin")}</Badge>}
        </div>
        <p className="text-muted-foreground">
          {t("editProduct.subtitle")}
        </p>
      </div>

      {/* Product Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t("editProduct.overview.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Image
              src={images[mainImageIndex] || product?.mainImage || "/placeholder.svg"}
              alt={product?.name || "Product"}
              width={100}
              height={100}
              className="rounded-lg object-cover flex-shrink-0"
            />
            <div>
              <h3 className="text-xl font-semibold">{product?.name}</h3>
              <p className="text-muted-foreground font-mono">{product?.sku}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{product?.brand}</Badge>
                <Badge variant="secondary">{product?.category}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Fields */}
      <div className="space-y-6">
        
        {/* Product Name */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("editProduct.fields.productName.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("editProduct.fields.productName.placeholder")}
                className="flex-1"
              />
              <Button
                onClick={() => handleSaveField('name', name)}
                disabled={savingStates.name || name === (product?.name || "")}
                size="sm"
                className="min-w-20"
              >
                {savingStates.name ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : successStates.name ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    {t("editProduct.actions.save")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("editProduct.fields.description.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("editProduct.fields.description.placeholder")}
                rows={4}
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSaveField('description', description)}
                  disabled={savingStates.description || description === (product?.description || "")}
                  size="sm"
                  className="min-w-20"
                >
                  {savingStates.description ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : successStates.description ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      {t("editProduct.actions.save")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("editProduct.fields.brand.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={t("editProduct.fields.brand.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brandOption) => (
                    <SelectItem key={brandOption} value={brandOption}>
                      {brandOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => handleSaveField('brand', brand)}
                disabled={savingStates.brand || brand === (product?.brand || "")}
                size="sm"
                className="min-w-20"
              >
                {savingStates.brand ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : successStates.brand ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    {t("editProduct.actions.save")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("editProduct.fields.category.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={t("editProduct.fields.category.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((categoryOption) => (
                    <SelectItem key={categoryOption} value={categoryOption}>
                      {categoryOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => handleSaveField('category', category)}
                disabled={savingStates.category || category === (product?.category || "")}
                size="sm"
                className="min-w-20"
              >
                {savingStates.category ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : successStates.category ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    {t("editProduct.actions.save")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weight */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("editProduct.fields.weight.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Input
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={t("editProduct.fields.weight.placeholder")}
                className="flex-1"
              />
              <Button
                onClick={() => handleSaveField('weight', weight)}
                disabled={savingStates.weight || weight === (product?.specifications?.weight || "")}
                size="sm"
                className="min-w-20"
              >
                {savingStates.weight ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : successStates.weight ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    {t("editProduct.actions.save")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("editProduct.fields.dimensions.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="length">{t("editProduct.fields.dimensions.length")}</Label>
                  <Input
                    id="length"
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder={t("editProduct.fields.dimensions.length")}
                  />
                </div>
                <div>
                  <Label htmlFor="width">{t("editProduct.fields.dimensions.width")}</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder={t("editProduct.fields.dimensions.width")}
                  />
                </div>
                <div>
                  <Label htmlFor="height">{t("editProduct.fields.dimensions.height")}</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={t("editProduct.fields.dimensions.height")}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveDimensions}
                  disabled={
                    savingStates.primaryDimensions ||
                    (length === (product?.primaryDimensions?.length?.toString() || "") &&
                     width === (product?.primaryDimensions?.width?.toString() || "") &&
                     height === (product?.primaryDimensions?.height?.toString() || ""))
                  }
                  size="sm"
                  className="min-w-20"
                >
                  {savingStates.primaryDimensions ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : successStates.primaryDimensions ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      {t("editProduct.actions.save")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("editProduct.fields.images.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((slotIndex) => (
                <div key={slotIndex} className="space-y-3">
                  <div className="relative">
                    {images[slotIndex] ? (
                      <div className="relative group">
                        <Image
                          src={images[slotIndex]}
                          alt={`Product image ${slotIndex + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        {/* Main image indicator */}
                        {mainImageIndex === slotIndex && (
                          <Badge className="absolute top-2 left-2 bg-green-500">
                            {t("editProduct.fields.images.main")}
                          </Badge>
                        )}
                        {/* Remove button */}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(slotIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="h-8 w-8 mb-2" />
                        <span className="text-sm">{t("editProduct.fields.images.noImage")}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {/* Upload button */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImageUpload(file, slotIndex)
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingStates[slotIndex]}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={uploadingStates[slotIndex]}
                      >
                        {uploadingStates[slotIndex] ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : successStates[`image_${slotIndex}`] ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {images[slotIndex] ? t("editProduct.fields.images.replace") : t("editProduct.fields.images.upload")}
                      </Button>
                    </div>
                    
                    {/* Set as main button */}
                    {images[slotIndex] && mainImageIndex !== slotIndex && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => handleSetMainImage(slotIndex)}
                        disabled={savingStates.mainImage}
                      >
                        {savingStates.mainImage ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          t("editProduct.fields.images.setAsMain")
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {successStates.mainImage && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">{t("editProduct.fields.images.mainImageUpdated")}</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Actions */}
      <div className="mt-8 pt-6 border-t">
        <div className="flex items-center justify-between">
          <Link href={`/product/${product?.sku}`}>
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              {t("editProduct.actions.viewProductPage")}
            </Button>
          </Link>
          <Link href="/my-contributions">
            <Button>
              {t("editProduct.actions.backToContributions")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
