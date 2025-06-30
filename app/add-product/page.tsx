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
import { optimizeAndUploadImage, validateImageFile } from "@/lib/storage"
import { normalizeProductName, normalizeBrandName, validateProductName } from "@/lib/product-normalizer"
import { useLanguage } from "@/components/language-provider"
import { toast } from "@/hooks/use-toast"
import { searchBrands, createBrandIfNotExists, searchCategories, createCategoryIfNotExists } from "@/lib/firestore"
import { useRef } from "react"

export default function AddProductPage() {
  const { isLoggedIn, userData, loading, user } = useAuth()
  const { t, locale } = useLanguage()
  const router = useRouter()
  const { unit } = useUnit()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
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
  const [brandOptions, setBrandOptions] = useState<string[]>([])
  const [categoryOptions, setCategoryOptions] = useState<any[]>([])
  const brandInputRef = useRef<HTMLInputElement>(null)
  const categoryInputRef = useRef<HTMLInputElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState<number>(0)

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

  const handleBrandInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, brand: value }));
    if (value.length > 0) {
      const found = await searchBrands(value);
      setBrandOptions(found);
    } else {
      setBrandOptions([]);
    }
  };

  const handleCategoryInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, category: value }));
    setSelectedCategory(null);
    if (value.length > 0) {
      const found = await searchCategories(value);
      setCategoryOptions(found);
    } else {
      setCategoryOptions([]);
    }
  };

  const handleBrandSelect = (name: string) => {
    setFormData((prev) => ({ ...prev, brand: name }));
    setBrandOptions([]);
    if (brandInputRef.current) brandInputRef.current.value = name;
  };

  const handleCategorySelect = (cat: any) => {
    setFormData((prev) => ({ ...prev, category: cat.name }));
    setSelectedCategory(cat);
    setCategoryOptions([]);
    if (categoryInputRef.current) categoryInputRef.current.value = cat.translations?.[locale] || cat.name;
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    // Filtrar duplicados por nombre y tamaño
    const allFiles = [...images];
    for (const file of newFiles) {
      if (allFiles.length >= 3) break;
      // Evitar duplicados por nombre y tamaño
      if (!allFiles.some(f => f.name === file.name && f.size === file.size)) {
        const validation = validateImageFile(file);
        if (!validation.isValid) {
          toast({ title: "Imagen no válida", description: validation.error, variant: "destructive" });
          continue;
        }
        allFiles.push(file);
      }
    }
    if (allFiles.length > 3) {
      toast({ title: "Máximo 3 imágenes", variant: "destructive" });
      allFiles.length = 3;
    }
    setImages(allFiles);
    setImagePreviews(allFiles.map(file => URL.createObjectURL(file)));
    if (allFiles.length === 1) setMainImageIndex(0);
  };

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

      let imageUrls: string[] = [];
      if (images.length > 0) {
        setIsUploadingImage(true);
        try {
          // Ordenar las imágenes para que la principal esté primero
          const orderedImages = [...images];
          if (mainImageIndex > 0) {
            const [mainImg] = orderedImages.splice(mainImageIndex, 1);
            orderedImages.unshift(mainImg);
          }
          imageUrls = await Promise.all(
            orderedImages.map(file => optimizeAndUploadImage(file, "products", formData.sku.toUpperCase()))
          );
          toast({
            title: t("addProduct.form.imageUploaded"),
            description: t("addProduct.form.imageUploadedDesc"),
          })
        } catch (err) {
          console.error("Image upload failed:", err)
          toast({
            title: t("addProduct.form.imageUploadFailed"),
            description: t("addProduct.form.imageUploadFailedDesc"),
            variant: "destructive",
          })
          // Continue without image
        } finally {
          setIsUploadingImage(false);
        }
      }

      // Validar y normalizar el nombre aquí
      const validation = validateProductName(formData.name)
      let finalName = formData.name
      if (validation.suggestion && validation.suggestion !== formData.name) {
        finalName = validation.suggestion
      }

      // Convertir dimensiones a mm si es necesario
      const parseAndConvert = (value: string) => {
        const num = Number.parseFloat(value)
        if (isNaN(num)) return 0
        return unit === "inches" ? num * 25.4 : num
      }

      const productData = {
        name: normalizeProductName(finalName),
        sku: formData.sku.toUpperCase(),
        brand: normalizeBrandName(formData.brand),
        category: formData.category,
        description: formData.description,
        primaryDimensions: {
          length: parseAndConvert(formData.length),
          width: parseAndConvert(formData.width),
          height: parseAndConvert(formData.height),
          unit: "mm",
        },
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
        images: imageUrls,
        mainImage: imageUrls[0] || "/placeholder.svg?height=400&width=400",
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
              <div className="relative">
                <Input
                  id="brand"
                  type="text"
                  placeholder={t("addProduct.form.brandPlaceholder")}
                  value={formData.brand}
                  onChange={handleBrandInput}
                  ref={brandInputRef}
                  autoComplete="off"
                  required
                />
                {brandOptions.length > 0 && (
                  <ul className="absolute z-10 bg-background border border-border rounded w-full mt-1 max-h-40 overflow-auto shadow">
                    {brandOptions.map((option) => (
                      <li
                        key={option}
                        className="px-3 py-2 cursor-pointer hover:bg-primary/10"
                        onClick={() => handleBrandSelect(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

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
              <div className="relative">
                <Input
                  id="category"
                  type="text"
                  placeholder={t("addProduct.form.categoryPlaceholder")}
                  value={selectedCategory ? (selectedCategory.translations?.[locale] || selectedCategory.name) : formData.category}
                  onChange={handleCategoryInput}
                  ref={categoryInputRef}
                  autoComplete="off"
                  required
                />
                {categoryOptions.length > 0 && (
                  <ul className="absolute z-10 bg-background border border-border rounded w-full mt-1 max-h-40 overflow-auto shadow">
                    {categoryOptions.map((option) => (
                      <li
                        key={option.name}
                        className="px-3 py-2 cursor-pointer hover:bg-primary/10"
                        onClick={() => handleCategorySelect(option)}
                      >
                        {option.translations?.[locale] || option.name}
                      </li>
                    ))}
                  </ul>
                )}
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
                  {t("addProduct.form.boxDimensions")} * {unit === "mm" ? t("addProduct.form.inMillimeters") : t("addProduct.form.inInches")}
                </Label>
                <Badge variant="secondary">{unit}</Badge>
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

              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImagesChange}
                  disabled={isUploadingImage}
                  className="hidden"
                />
                <label htmlFor="image" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t("addProduct.form.imageUpload")}</p>
                  <p className="text-sm text-muted-foreground">{t("addProduct.form.maxImages")}</p>
                  <p className="text-sm text-muted-foreground">{t("addProduct.form.imageFormats")}</p>
                </label>
                {images.length > 0 && (
                  <>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {images.map((file, idx) => (
                        <div
                          key={idx}
                          className={`relative border rounded-lg p-2 bg-muted/50 flex flex-col items-center cursor-pointer select-none ${mainImageIndex === idx ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => setMainImageIndex(idx)}
                          tabIndex={0}
                          role="button"
                          aria-pressed={mainImageIndex === idx}
                        >
                          <img
                            src={imagePreviews[idx] || "/placeholder.svg"}
                            alt={file.name}
                            className="w-20 h-20 object-cover rounded mb-2"
                          />
                          <span className="text-xs font-medium mb-1 truncate max-w-[80px]">{file.name}</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="radio"
                              name="mainImage"
                              checked={mainImageIndex === idx}
                              readOnly
                              className="accent-primary hidden"
                            />
                            <span className="text-xs">{t("addProduct.form.setAsMain")}</span>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-5 w-5 rounded-full p-0"
                            onClick={e => {
                              e.stopPropagation();
                              const newImages = images.filter((_, i) => i !== idx);
                              const newPreviews = imagePreviews.filter((_, i) => i !== idx);
                              setImages(newImages);
                              setImagePreviews(newPreviews);
                              if (mainImageIndex === idx) setMainImageIndex(0);
                              else if (mainImageIndex > idx) setMainImageIndex(mainImageIndex - 1);
                            }}
                            disabled={isUploadingImage}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-4">
                      <Badge variant="secondary">{t("addProduct.form.imageReady")}</Badge>
                    </div>
                  </>
                )}
              </div>
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
