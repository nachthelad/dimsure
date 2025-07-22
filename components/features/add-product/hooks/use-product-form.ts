import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/components/layout/language-provider";
import { useUnit } from "@/components/layout/unit-provider";
import { toast } from "@/hooks/use-toast";
import { ProductService } from "@/lib/services/product-service";
import { validateImageFile } from "@/lib/storage";
import {
  normalizeProductName,
  validateProductName,
} from "@/lib/product-normalizer";

export type ValidationErrors = {
  name?: string;
  sku?: string;
  brand?: string;
  category?: string;
  dimensions?: string;
  weight?: string;
  images?: string;
};

export type FormData = {
  name: string;
  sku: string;
  brand: string;
  category: string;
  description: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  image: File | null;
};

export function useProductForm() {
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

  const [formData, setFormData] = useState<FormData>({
    name: "",
    sku: "",
    brand: "",
    category: "",
    description: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    image: null,
  });

  const [brandOptions, setBrandOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [moderationResults, setModerationResults] = useState<any[]>([]);

  const brandInputRef = useRef<HTMLInputElement>(null!);
  const categoryInputRef = useRef<HTMLInputElement>(null!);

  // Clear field error
  const clearFieldError = (field: keyof ValidationErrors) => {
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Validate specific field
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
    }
    return undefined;
  };

  // Validate dimensions
  const validateDimensions = (): string | undefined => {
    const { length, width, height } = formData;
    if (!length.trim() || !width.trim() || !height.trim()) {
      return t("addProduct.validation.dimensionsRequired");
    }

    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);

    if (isNaN(lengthNum) || isNaN(widthNum) || isNaN(heightNum)) {
      return t("addProduct.validation.dimensionsInvalid");
    }

    if (lengthNum <= 0 || widthNum <= 0 || heightNum <= 0) {
      return t("addProduct.validation.dimensionsPositive");
    }

    return undefined;
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Validate individual fields
    Object.keys(formData).forEach((field) => {
      const value = formData[field as keyof FormData];
      if (typeof value === "string") {
        const error = validateField(field as keyof ValidationErrors, value);
        if (error) errors[field as keyof ValidationErrors] = error;
      }
    });

    // Validate dimensions
    const dimensionError = validateDimensions();
    if (dimensionError) errors.dimensions = dimensionError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form field changes
  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
    clearFieldError("name");
  };

  const handleSkuChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sku: value }));
    clearFieldError("sku");
  };

  const handleBrandChange = (value: string) => {
    setFormData((prev) => ({ ...prev, brand: value }));
    clearFieldError("brand");
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    clearFieldError("category");
  };

  const handleDimensionChange = (
    field: "length" | "width" | "height",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError("dimensions");
  };

  const handleWeightChange = (value: string) => {
    setFormData((prev) => ({ ...prev, weight: value }));
    clearFieldError("weight");
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const previews: string[] = [];

    files.forEach((file) => {
      const validationResult = validateImageFile(file);
      if (validationResult.isValid) {
        validFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          previews.push(e.target?.result as string);
          setImagePreviews([...previews]);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: t("addProduct.imageError"),
          description: validationResult.error,
          variant: "destructive",
        });
      }
    });

    setImages(validFiles);
    setMainImageIndex(0);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: t("addProduct.validationError"),
        description: t("addProduct.pleaseFixErrors"),
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: t("auth.notLoggedIn"),
        description: t("auth.pleaseLogin"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Parse and convert dimensions
      const parseAndConvert = (value: string) => {
        const numValue = parseFloat(value);
        if (unitSystem === "imperial") {
          // Convert inches to mm
          return Math.round(numValue * 25.4);
        }
        return Math.round(numValue);
      };

      const productData = {
        name: normalizeProductName(formData.name),
        sku: formData.sku.trim().toUpperCase(),
        brand: formData.brand.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        primaryDimensions: {
          length: parseAndConvert(formData.length),
          width: parseAndConvert(formData.width),
          height: parseAndConvert(formData.height),
        },
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
      };

      // Create product
      const sku = await ProductService.createProduct(productData, user.uid);

      // Upload images if any
      if (images.length > 0) {
        setIsUploadingImage(true);
        // Image upload logic would go here
        setIsUploadingImage(false);
      }

      setIsSuccess(true);
      toast({
        title: t("addProduct.success"),
        description: t("addProduct.productCreated"),
      });

      // Redirect to product page
      setTimeout(() => {
        router.push(`/product/${sku}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error creating product:", error);
      setError(error.message || t("addProduct.error"));
      toast({
        title: t("addProduct.error"),
        description: error.message || t("addProduct.errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    formData,
    isSubmitting,
    isUploadingImage,
    isSuccess,
    error,
    validationErrors,
    brandOptions,
    categoryOptions,
    selectedCategory,
    images,
    imagePreviews,
    mainImageIndex,
    moderationResults,

    // Refs
    brandInputRef,
    categoryInputRef,

    // Handlers
    handleNameChange,
    handleSkuChange,
    handleBrandChange,
    handleCategoryChange,
    handleDimensionChange,
    handleWeightChange,
    handleImagesChange,
    handleSubmit,

    // Utilities
    clearFieldError,
    validateField,
    validateForm,
    setSelectedCategory,
    setMainImageIndex,
  };
}
