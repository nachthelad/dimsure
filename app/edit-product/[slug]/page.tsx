"use client";

import React, { useState, useEffect } from "react";
import { useRouter, notFound } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  Edit,
  X,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/components/layout/language-provider";
import {
  getProduct,
  updateProductField,
  getAllBrands,
  getAllCategories,
  uploadProductImage,
  updateProductImages,
  getProductDisputes,
  updateDisputeStatus,
} from "@/lib/firestore";
import { APP_CONSTANTS } from "@/lib/constants";
import type { Product, Dispute } from "@/lib/types";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = React.use(params);
  const { isLoggedIn, loading, user, userData } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  const [provisionalDisputeId, setProvisionalDisputeId] = useState<
    string | null
  >(null);

  // Individual field states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Loading states for individual saves
  const [savingStates, setSavingStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [successStates, setSuccessStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [uploadingStates, setUploadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  const isAdmin =
    userData?.email === APP_CONSTANTS.ADMIN_EMAIL ||
    userData?.email === APP_CONSTANTS.DEBUG_AUTHORIZED_EMAIL;

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push(
        "/login?redirect=" + encodeURIComponent(window.location.pathname)
      );
    }
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(resolvedParams.slug);
        if (!productData) {
          notFound();
        }

        setProduct(productData);

        // Check if user can edit this product
        const isOwner = user && productData.createdBy === user.uid;
        const isAdminUser = isAdmin;
        setCanEdit(isOwner || isAdminUser);

        // Set initial field values
        setName(productData.name || "");
        setDescription(productData.description || "");
        setBrand(productData.brand || "");
        setCategory(productData.category || "");
        setWeight(
          productData.specifications?.weight?.replace(/[^0-9.]/g, "") || ""
        );
        setLength(productData.primaryDimensions?.length?.toString() || "");
        setWidth(productData.primaryDimensions?.width?.toString() || "");
        setHeight(productData.primaryDimensions?.height?.toString() || "");
        setImages(productData.images || []);
        setMainImageIndex(
          productData.images?.indexOf(productData.mainImage || "") || 0
        );

        // Check for provisional disputes
        if (isAdminUser) {
          const disputes = await getProductDisputes(productData.urlSlug);
          const provisionalDispute = disputes.find(
            (d: Dispute) => d.status === "in_review"
          );
          if (provisionalDispute) {
            setProvisionalDisputeId(provisionalDispute.id);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
      } finally {
        setIsLoadingProduct(false);
      }
    };

    if (isLoggedIn && user) {
      fetchProduct();
    }
  }, [resolvedParams.slug, isLoggedIn, user, isAdmin]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          getAllBrands(),
          getAllCategories(),
        ]);
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleSaveField = async (field: string, value: any) => {
    if (!user || !product) return;

    const originalField = field;
    setSavingStates((prev) => ({ ...prev, [field]: true }));

    try {
      let processedValue = value;

      // Handle weight specially - store in specifications
      if (field === "weight") {
        const currentSpecs = product.specifications || {};
        processedValue = {
          ...currentSpecs,
          weight: value,
        };
        field = "specifications"; // Update the specifications field instead
      }

      await updateProductField(
        product.urlSlug,
        field,
        processedValue,
        user.uid
      );

      // Update local product state
      if (originalField === "weight") {
        // Special handling for weight - update specifications
        setProduct((prev) =>
          prev
            ? {
                ...prev,
                specifications: processedValue,
              }
            : null
        );
      } else {
        setProduct((prev) =>
          prev ? { ...prev, [field]: processedValue } : null
        );
      }

      // Show success feedback
      setSuccessStates((prev) => ({ ...prev, [originalField]: true }));
      setTimeout(() => {
        setSuccessStates((prev) => ({ ...prev, [originalField]: false }));
      }, 2000);

      // Si el usuario es provisionalEditor, quitar el permiso de la disputa
      if (provisionalDisputeId) {
        await updateDisputeStatus(provisionalDisputeId, "resolved", {
          action: "Product edited by provisional editor",
          reason: "Dispute resolved by community",
          resolvedBy: user.uid,
        });
        setProvisionalDisputeId(null);
      }
    } catch (error) {
      console.error(`Error saving ${originalField}:`, error);
    } finally {
      setSavingStates((prev) => ({ ...prev, [originalField]: false }));
    }
  };

  const handleSaveDimensions = async () => {
    await handleSaveField("primaryDimensions", null); // Value is processed inside handleSaveField
  };

  const handleImageUpload = async (file: File, slotIndex: number) => {
    if (!user || !product) return;

    setUploadingStates((prev) => ({ ...prev, [slotIndex]: true }));

    try {
      const imageUrl = await uploadProductImage(
        file,
        product.urlSlug,
        slotIndex
      );

      // Update images array
      const newImages = [...images];
      newImages[slotIndex] = imageUrl;
      setImages(newImages);

      // Save to database
      await updateProductImages(
        product.urlSlug,
        newImages,
        mainImageIndex,
        user.uid
      );

      // Update local product state
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              images: newImages,
              mainImage: newImages[mainImageIndex] || newImages[0] || "",
            }
          : null
      );

      // Show success feedback
      setSuccessStates((prev) => ({ ...prev, [`image_${slotIndex}`]: true }));
      setTimeout(() => {
        setSuccessStates((prev) => ({
          ...prev,
          [`image_${slotIndex}`]: false,
        }));
      }, 2000);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingStates((prev) => ({ ...prev, [slotIndex]: false }));
    }
  };

  const handleSetMainImage = async (imageIndex: number) => {
    if (!user || !product || !images[imageIndex]) return;

    setMainImageIndex(imageIndex);

    try {
      await updateProductImages(product.urlSlug, images, imageIndex, user.uid);

      // Update local product state
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              mainImage: images[imageIndex] || "",
            }
          : null
      );

      // Show success feedback
      setSuccessStates((prev) => ({ ...prev, mainImage: true }));
      setTimeout(() => {
        setSuccessStates((prev) => ({ ...prev, mainImage: false }));
      }, 2000);
    } catch (error) {
      console.error("Error setting main image:", error);
      alert("Failed to set main image. Please try again.");
    }
  };

  const handleRemoveImage = async (imageIndex: number) => {
    if (!user || !product) return;

    const newImages = images.filter((_, i) => i !== imageIndex);
    setImages(newImages);

    // Adjust main image index if necessary
    if (mainImageIndex === imageIndex) {
      setMainImageIndex(0);
    } else if (mainImageIndex > imageIndex) {
      setMainImageIndex(mainImageIndex - 1);
    }

    try {
      await updateProductImages(
        product.urlSlug,
        newImages,
        mainImageIndex === imageIndex ? 0 : mainImageIndex,
        user.uid
      );

      // Update local product state
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              images: newImages,
              mainImage:
                newImages[mainImageIndex === imageIndex ? 0 : mainImageIndex] ||
                newImages[0] ||
                "",
            }
          : null
      );

      // Show success feedback
      setSuccessStates((prev) => ({ ...prev, imageRemoved: true }));
      setTimeout(() => {
        setSuccessStates((prev) => ({ ...prev, imageRemoved: false }));
      }, 2000);
    } catch (error) {
      console.error("Error removing image:", error);
      alert("Failed to remove image. Please try again.");
    }
  };

  if (loading || isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  if (!product) {
    notFound();
  }

  if (!canEdit) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert>
          <AlertDescription>
            You don't have permission to edit this product.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/product/${product.urlSlug}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("editProduct.backToProduct")}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{t("editProduct.title")}</h1>
            <p className="text-muted-foreground">{product.name}</p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Package className="h-3 w-3" />
          {product.sku}
        </Badge>
      </div>

      {/* Provisional Editor Notice */}
      {provisionalDisputeId && (
        <Alert className="mb-6">
          <AlertDescription>
            You are editing this product as a provisional editor due to a
            community dispute. Your changes will resolve the dispute.
          </AlertDescription>
        </Alert>
      )}

      {/* Product Name */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {t("editProduct.fields.name")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t("editProduct.fields.name")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("editProduct.fields.namePlaceholder")}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => handleSaveField("name", name)}
                disabled={savingStates.name}
                size="sm"
              >
                {savingStates.name ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : successStates.name ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {savingStates.name
                  ? t("editProduct.saving")
                  : successStates.name
                  ? t("editProduct.saved")
                  : t("editProduct.save")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {t("editProduct.fields.description")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">
                {t("editProduct.fields.description")}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("editProduct.fields.descriptionPlaceholder")}
                rows={4}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => handleSaveField("description", description)}
                disabled={savingStates.description}
                size="sm"
              >
                {savingStates.description ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : successStates.description ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {savingStates.description
                  ? t("editProduct.saving")
                  : successStates.description
                  ? t("editProduct.saved")
                  : t("editProduct.save")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand and Category */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              {t("editProduct.fields.brand")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="brand">{t("editProduct.fields.brand")}</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("editProduct.fields.brandPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brandOption) => (
                      <SelectItem key={brandOption} value={brandOption}>
                        {brandOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSaveField("brand", brand)}
                  disabled={savingStates.brand}
                  size="sm"
                >
                  {savingStates.brand ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : successStates.brand ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {savingStates.brand
                    ? t("editProduct.saving")
                    : successStates.brand
                    ? t("editProduct.saved")
                    : t("editProduct.save")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              {t("editProduct.fields.category")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">
                  {t("editProduct.fields.category")}
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("editProduct.fields.categoryPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((categoryOption) => (
                      <SelectItem key={categoryOption} value={categoryOption}>
                        {categoryOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => handleSaveField("category", category)}
                  disabled={savingStates.category}
                  size="sm"
                >
                  {savingStates.category ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : successStates.category ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {savingStates.category
                    ? t("editProduct.saving")
                    : successStates.category
                    ? t("editProduct.saved")
                    : t("editProduct.save")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dimensions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {t("editProduct.fields.dimensionsTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length">
                  {t("editProduct.fields.dimensions.length")}
                </Label>
                <Input
                  id="length"
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder={t("editProduct.fields.dimensions.length")}
                />
              </div>
              <div>
                <Label htmlFor="width">
                  {t("editProduct.fields.dimensions.width")}
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder={t("editProduct.fields.dimensions.width")}
                />
              </div>
              <div>
                <Label htmlFor="height">
                  {t("editProduct.fields.dimensions.height")}
                </Label>
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
                disabled={savingStates.primaryDimensions}
                size="sm"
              >
                {savingStates.primaryDimensions ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : successStates.primaryDimensions ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {savingStates.primaryDimensions
                  ? t("editProduct.saving")
                  : successStates.primaryDimensions
                  ? t("editProduct.saved")
                  : t("editProduct.save")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weight */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {t("editProduct.fields.weight")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="weight">{t("editProduct.fields.weight")}</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={t("editProduct.fields.weightPlaceholder")}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => handleSaveField("weight", weight)}
                disabled={savingStates.weight}
                size="sm"
              >
                {savingStates.weight ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : successStates.weight ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {savingStates.weight
                  ? t("editProduct.saving")
                  : successStates.weight
                  ? t("editProduct.saved")
                  : t("editProduct.save")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            {t("editProduct.fields.images")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((slotIndex) => (
                <div key={slotIndex} className="space-y-2">
                  <Label>
                    {slotIndex === 0
                      ? t("editProduct.fields.mainImage")
                      : `${t("editProduct.fields.image")} ${slotIndex + 1}`}
                  </Label>
                  <div className="relative">
                    {images[slotIndex] ? (
                      <div className="relative">
                        <Image
                          src={images[slotIndex]}
                          alt={`Product image ${slotIndex + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          {slotIndex !== mainImageIndex && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleSetMainImage(slotIndex)}
                              disabled={savingStates.mainImage}
                            >
                              {savingStates.mainImage ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveImage(slotIndex)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        {slotIndex === mainImageIndex && (
                          <Badge className="absolute top-2 left-2">
                            {t("editProduct.fields.mainImage")}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, slotIndex);
                              }
                            }}
                            className="hidden"
                            id={`image-upload-${slotIndex}`}
                          />
                          <label
                            htmlFor={`image-upload-${slotIndex}`}
                            className="cursor-pointer"
                          >
                            <div className="text-muted-foreground">
                              {uploadingStates[slotIndex] ? (
                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                              ) : (
                                <Edit className="h-8 w-8 mx-auto mb-2" />
                              )}
                              <p className="text-sm">
                                {uploadingStates[slotIndex]
                                  ? t("editProduct.uploading")
                                  : t("editProduct.fields.uploadImage")}
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
