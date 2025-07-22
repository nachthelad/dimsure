"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Package, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUnit } from "@/components/layout/unit-provider";
import { useAuth } from "@/hooks/useAuth";
import { createProduct, uploadProductImage } from "@/lib/firestore";
import { validateImageFile } from "@/lib/storage";
import {
  normalizeProductName,
  validateProductName,
} from "@/lib/product-normalizer";
import { useLanguage } from "@/components/layout/language-provider";
import { toast } from "@/hooks/use-toast";
import {
  searchBrands,
  createBrandIfNotExists,
  searchCategories,
  createCategoryIfNotExists,
} from "@/lib/firestore";
import { ProductNameField } from "./add-product/product-name-field";
import { BrandField } from "@/components/features/add-product/brand-field";
import { SkuField } from "@/components/features/add-product/sku-field";
import { CategoryField } from "@/components/features/add-product/category-field";
import { DescriptionField } from "@/components/features/add-product/description-field";
import { DimensionsField } from "@/components/features/add-product/dimensions-field";
import { WeightField } from "@/components/features/add-product/weight-field";
import { ImageUploadField } from "@/components/features/add-product/image-upload-field";

// Tipo para los errores de validación
type ValidationErrors = {
  name?: string;
  sku?: string;
  brand?: string;
  category?: string;
  dimensions?: string;
  weight?: string;
  images?: string;
};

export function AddProductForm() {
  const { isLoggedIn, userData, loading, user } = useAuth();
  const { t, locale } = useLanguage();
  const router = useRouter();
  const { unitSystem, getDimensionUnit } = useUnit();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
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
  });
  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const brandInputRef = useRef<HTMLInputElement>(null!);
  const categoryInputRef = useRef<HTMLInputElement>(null!);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [moderationResults, setModerationResults] = useState<any[]>([]);

  // Función para limpiar errores de un campo específico
  const clearFieldError = (field: keyof ValidationErrors) => {
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Función para validar un campo específico
  const validateField = (
    field: keyof ValidationErrors,
    value: string
  ): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return t("addProduct.validation.nameRequired");
        if (value.trim().length < 3)
          return t("addProduct.validation.nameMinLength");
        if (value.trim().length > 100)
          return t("addProduct.validation.nameMaxLength");
        break;
      case "sku":
        if (!value.trim()) return t("addProduct.validation.skuRequired");
        if (value.trim().length < 2)
          return t("addProduct.validation.skuMinLength");
        if (value.trim().length > 50)
          return t("addProduct.validation.skuMaxLength");
        break;
      case "brand":
        if (!value.trim()) return t("addProduct.validation.brandRequired");
        break;
      case "category":
        if (!value.trim()) return t("addProduct.validation.categoryRequired");
        break;
      case "weight":
        if (
          value.trim() &&
          (Number.parseFloat(value) <= 0 || isNaN(Number.parseFloat(value)))
        ) {
          return t("addProduct.validation.weightPositive");
        }
        break;
    }
    return undefined;
  };

  // Función para validar dimensiones
  const validateDimensions = (): string | undefined => {
    if (
      !formData.length.trim() ||
      !formData.width.trim() ||
      !formData.height.trim()
    ) {
      return t("addProduct.validation.dimensionsRequired");
    }

    const length = Number.parseFloat(formData.length);
    const width = Number.parseFloat(formData.width);
    const height = Number.parseFloat(formData.height);

    if (
      isNaN(length) ||
      length <= 0 ||
      isNaN(width) ||
      width <= 0 ||
      isNaN(height) ||
      height <= 0
    ) {
      return t("addProduct.validation.dimensionsPositive");
    }

    return undefined;
  };

  // Función para validar todo el formulario
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Validar campos requeridos
    errors.name = validateField("name", formData.name);
    errors.sku = validateField("sku", formData.sku);
    errors.brand = validateField("brand", formData.brand);
    errors.category = validateField("category", formData.category);
    errors.dimensions = validateDimensions();
    errors.weight = validateField("weight", formData.weight);

    // Filtrar errores undefined
    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value !== undefined)
    ) as ValidationErrors;

    setValidationErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
    // Validar en tiempo real si el campo está vacío o tiene errores
    const error = validateField("name", value);
    if (error) {
      setValidationErrors((prev) => ({ ...prev, name: error }));
    } else {
      clearFieldError("name");
    }
  };

  const handleSkuChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sku: value }));
    // Validar en tiempo real si el campo está vacío o tiene errores
    const error = validateField("sku", value);
    if (error) {
      setValidationErrors((prev) => ({ ...prev, sku: error }));
    } else {
      clearFieldError("sku");
    }
  };

  const handleBrandChange = (value: string) => {
    setFormData((prev) => ({ ...prev, brand: value }));
    // Validar en tiempo real si el campo está vacío
    const error = validateField("brand", value);
    if (error) {
      setValidationErrors((prev) => ({ ...prev, brand: error }));
    } else {
      clearFieldError("brand");
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    // Validar en tiempo real si el campo está vacío
    const error = validateField("category", value);
    if (error) {
      setValidationErrors((prev) => ({ ...prev, category: error }));
    } else {
      clearFieldError("category");
    }
  };

  const handleDimensionChange = (
    field: "length" | "width" | "height",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Validar dimensiones en tiempo real
    const error = validateDimensions();
    if (error) {
      setValidationErrors((prev) => ({ ...prev, dimensions: error }));
    } else {
      clearFieldError("dimensions");
    }
  };

  const handleWeightChange = (value: string) => {
    setFormData((prev) => ({ ...prev, weight: value }));
    // Validar en tiempo real si el campo tiene errores (solo si no está vacío)
    const error = validateField("weight", value);
    if (error) {
      setValidationErrors((prev) => ({ ...prev, weight: error }));
    } else {
      clearFieldError("weight");
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    // Filtrar duplicados por nombre y tamaño
    const allFiles = [...images];
    for (const file of newFiles) {
      if (allFiles.length >= 3) break;
      // Evitar duplicados por nombre y tamaño
      if (!allFiles.some((f) => f.name === file.name && f.size === file.size)) {
        const validation = validateImageFile(file);
        if (!validation.isValid) {
          setValidationErrors((prev) => ({
            ...prev,
            images: validation.error,
          }));
          continue;
        }
        allFiles.push(file);
      }
    }
    if (allFiles.length > 3) {
      setValidationErrors((prev) => ({
        ...prev,
        images: t("addProduct.validation.maxImages"),
      }));
      allFiles.length = 3;
    } else {
      clearFieldError("images");
    }
    setImages(allFiles);
    setImagePreviews(allFiles.map((file) => URL.createObjectURL(file)));
    if (allFiles.length === 1) setMainImageIndex(0);
  };

  // Handler para pegar dimensiones en el campo Length
  const handleLengthPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    // Buscar 3 números separados por x, espacio o coma
    const match = text.match(
      /(\d+(?:\.\d+)?)[ x,]+(\d+(?:\.\d+)?)[ x,]+(\d+(?:\.\d+)?)/
    );
    if (match) {
      setFormData((prev) => ({
        ...prev,
        length: match[1],
        width: match[2],
        height: match[3],
      }));
      // Limpiar error de dimensiones
      clearFieldError("dimensions");
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setValidationErrors({});
    setModerationResults([]);

    try {
      // Validate user is logged in
      if (!user?.uid) {
        throw new Error(t("addProduct.validation.loginRequired"));
      }

      let imageUrls: string[] = [];
      let productStatus: "approved" | "pending" = "pending"; // Siempre pending
      const moderationDetails: any[] = [];
      if (images.length > 0) {
        setIsUploadingImage(true);
        try {
          // Subir imágenes sin moderación automática
          const orderedImages = [...images];
          if (mainImageIndex > 0) {
            const [mainImg] = orderedImages.splice(mainImageIndex, 1);
            orderedImages.unshift(mainImg);
          }
          imageUrls = await Promise.all(
            orderedImages.map((file, index) =>
              uploadProductImage(file, formData.sku.toUpperCase(), index)
            )
          );
          toast({
            title: t("addProduct.form.imageUploaded"),
            description: t("addProduct.form.imageUploadedDesc"),
          });
        } catch (err) {
          console.error("Image upload failed:", err);
          toast({
            title: t("addProduct.form.imageUploadFailed"),
            description: t("addProduct.form.imageUploadFailedDesc"),
            variant: "destructive",
          });
          // Continue without image
        } finally {
          setIsUploadingImage(false);
        }
      } else {
        moderationDetails.push({
          name: "N/A",
          error: "No se subieron imágenes para moderar.",
        });
        setModerationResults(moderationDetails);
      }

      // Ensure brand and category exist in database
      const finalBrand = await createBrandIfNotExists(formData.brand);
      const finalCategory = await createCategoryIfNotExists(formData.category);

      // Validar y normalizar el nombre aquí
      const validation = validateProductName(formData.name);
      let finalName = formData.name;
      if (validation.suggestion && validation.suggestion !== formData.name) {
        finalName = validation.suggestion;
      }

      // Convertir dimensiones a mm si es necesario
      const parseAndConvert = (value: string) => {
        const num = Number.parseFloat(value);
        if (isNaN(num)) return 0;
        return getDimensionUnit() === "inches" ? num * 25.4 : num;
      };

      const productData = {
        name: normalizeProductName(finalName),
        sku: formData.sku.toUpperCase(),
        brand: finalBrand,
        category: finalCategory,
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
          weight: formData.weight
            ? `${formData.weight}${unitSystem === "metric" ? "g" : "lb"}`
            : "Not specified",
        },
        status: productStatus, // Siempre pending
        moderationResults: moderationDetails,
      };

      const createdSku = await createProduct(productData, user.uid);

      setIsSuccess(true);
      toast({
        title: t("addProduct.success.title"),
        description: t("addProduct.success.message"),
      });

      // Redirect to product page after 2 seconds
      setTimeout(() => {
        router.push(`/product/${createdSku}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error creating product:", error);

      // Manejar errores específicos de SKU duplicado
      if (error.message.includes("already exists")) {
        setValidationErrors((prev) => ({
          ...prev,
          sku: t("addProduct.validation.skuExists"),
        }));
      } else {
        setError(error.message || t("common.error"));
      }

      toast({
        title: t("common.error"),
        description: error.message || t("common.error"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {t("addProduct.success.title")}
          </h2>
          <p className="text-muted-foreground mb-4">
            {t("addProduct.success.message")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("addProduct.success.redirecting")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const displayName =
    userData?.publicTag || user?.displayName || user?.email || "@newuser";

  return (
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
          <ProductNameField
            value={formData.name}
            onChange={handleNameChange}
            error={validationErrors.name}
            t={t}
          />

          <BrandField
            value={formData.brand}
            onChange={handleBrandChange}
            onInput={async (value) => {
              if (value.length > 0) {
                const found = await searchBrands(value);
                setBrandOptions(found);
              } else {
                setBrandOptions([]);
              }
            }}
            onSelect={(name) => {
              handleBrandChange(name);
              setBrandOptions([]);
              if (brandInputRef.current) brandInputRef.current.value = name;
            }}
            options={brandOptions}
            inputRef={brandInputRef}
            error={validationErrors.brand}
            t={t}
          />

          <SkuField
            value={formData.sku}
            onChange={handleSkuChange}
            error={validationErrors.sku}
            t={t}
          />

          <CategoryField
            value={formData.category}
            selectedCategory={selectedCategory}
            onChange={handleCategoryChange}
            onInput={async (value) => {
              setSelectedCategory(null);
              if (value.length > 0) {
                const found = await searchCategories(value);
                setCategoryOptions(found);
              } else {
                setCategoryOptions([]);
              }
            }}
            onSelect={(cat) => {
              handleCategoryChange(cat.name);
              setSelectedCategory(cat);
              setCategoryOptions([]);
              if (categoryInputRef.current)
                categoryInputRef.current.value =
                  cat.translations?.[locale] || cat.name;
            }}
            options={categoryOptions}
            inputRef={categoryInputRef}
            locale={locale}
            error={validationErrors.category}
            t={t}
          />

          <DescriptionField
            value={formData.description}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, description: value }))
            }
            t={t}
          />

          <DimensionsField
            length={formData.length}
            width={formData.width}
            height={formData.height}
            onChange={handleDimensionChange}
            onPaste={handleLengthPaste}
            error={validationErrors.dimensions}
            t={t}
          />

          <WeightField
            value={formData.weight}
            onChange={handleWeightChange}
            error={validationErrors.weight}
            t={t}
          />

          <ImageUploadField
            images={images}
            imagePreviews={imagePreviews}
            mainImageIndex={mainImageIndex}
            onImagesChange={handleImagesChange}
            onMainImageChange={setMainImageIndex}
            onImageRemove={(idx) => {
              const newImages = images.filter((_, i) => i !== idx);
              const newPreviews = imagePreviews.filter((_, i) => i !== idx);
              setImages(newImages);
              setImagePreviews(newPreviews);
              if (mainImageIndex === idx) setMainImageIndex(0);
              else if (mainImageIndex > idx)
                setMainImageIndex(mainImageIndex - 1);
            }}
            isUploading={isUploadingImage}
            error={validationErrors.images}
            t={t}
          />

          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>{t("addProduct.form.submittedBy")}</strong> {displayName}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("addProduct.form.attribution")}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || isUploadingImage}
          >
            {isUploadingImage
              ? t("addProduct.form.uploadingImage")
              : isSubmitting
              ? t("addProduct.form.submitting")
              : t("addProduct.form.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
