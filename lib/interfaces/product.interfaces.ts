// Segregated interfaces for different product concerns

export interface ProductIdentity {
  id: string;
  sku: string;
  urlSlug: string;
}

export interface ProductBasicInfo {
  name: string;
  brand?: string;
  category?: string;
  description?: string;
}

export interface ProductDimensions {
  primaryDimensions: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ProductMedia {
  mainImage?: string;
  images?: string[];
}

export interface ProductEngagement {
  likes?: number;
  views?: number;
  confidence?: number;
  likedBy?: string[];
}

export interface ProductMetadata {
  createdBy?: string;
  lastModifiedBy?: string;
  lastModified?: any;
  createdAt?: any;
  status?: "approved" | "pending" | "rejected";
}

export interface ProductSpecifications {
  specifications?: Record<string, any>;
}

// Composed interfaces for specific use cases
export interface ProductCardData
  extends ProductIdentity,
    ProductBasicInfo,
    ProductDimensions,
    ProductMedia,
    ProductEngagement {}

export interface ProductDetailData
  extends ProductIdentity,
    ProductBasicInfo,
    ProductDimensions,
    ProductMedia,
    ProductEngagement,
    ProductMetadata,
    ProductSpecifications {}

export interface ProductSearchResult
  extends ProductIdentity,
    ProductBasicInfo,
    ProductMedia {}
