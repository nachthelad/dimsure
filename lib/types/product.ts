export interface Product {
  id: string;
  name: string;
  sku: string;
  brand?: string;
  category?: string;
  primaryDimensions: ProductDimensions;
  likes?: number;
  confidence?: number;
  mainImage?: string;
  likedBy?: string[];
  images?: string[];
  views?: number;
  description?: string;
  createdBy?: string;
  lastModifiedBy?: string;
  lastModified?: any;
  createdAt?: any;
  specifications?: Record<string, any>;
  status?: ProductStatus;
  moderationResults?: ModerationResult[];
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export type ProductStatus = "approved" | "pending" | "rejected";

export interface ModerationResult {
  id: string;
  type: "image" | "text" | "content";
  status: "passed" | "failed" | "pending";
  score?: number;
  details?: Record<string, any>;
  timestamp: any;
}

export interface ProductFormData {
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
}

export interface ProductValidationErrors {
  name?: string;
  sku?: string;
  brand?: string;
  category?: string;
  dimensions?: string;
  weight?: string;
  images?: string;
}

export interface ProductSearchFilters {
  brand?: string;
  category?: string;
  minLength?: number;
  maxLength?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  sortBy?: "name" | "createdAt" | "likes" | "views";
  sortOrder?: "asc" | "desc";
}

export interface ProductStats {
  totalProducts: number;
  totalLikes: number;
  totalViews: number;
  averageConfidence: number;
  topBrands: Array<{ brand: string; count: number }>;
  topCategories: Array<{ category: string; count: number }>;
}
