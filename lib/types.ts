export interface Dispute {
  id: string;
  title?: string;
  description?: string;
  productSku?: string;
  productName?: string;
  disputeType?:
    | "measurement"
    | "description"
    | "category"
    | "image"
    | "weight"
    | "other";
  status?: "open" | "in_review" | "resolved" | "rejected";
  createdBy?: string;
  createdByTag?: string;
  createdAt?: any;
  votes?: {
    upvotes: number;
    downvotes: number;
    userVotes: { [userId: string]: "up" | "down" };
  };
  evidence?: {
    currentValue?: string;
    proposedValue?: string;
    reasoning?: string;
    imageUrl?: string;
  };
  resolution?: {
    action: string;
    reason: string;
    resolvedBy: string;
    resolvedAt: any;
  };
  productImages?: string[];
  resolutionPendingAt?: any;
  provisionalEditor?: string;
  productCreatedBy?: string;
  productLastModified?: any;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  urlSlug: string;
  brand?: string;
  category?: string;
  primaryDimensions: { length: number; width: number; height: number };
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
  status?: "approved" | "pending" | "rejected";
  moderationResults?: any[];
}

export interface BlogPost {
  id: string;
  title?: string;
  slug?: string;
  content?: string;
  coverImage?: string;
  createdAt?: any;
  author?: string;
  excerpt?: string;
  tags?: string[];
  status?: "draft" | "published" | "archived";
}

export interface Guide {
  id: string;
  title?: string;
  slug?: string;
  description?: string;
  category?: string;
  readTime?: string;
  author?: string;
  content?: string;
  coverImage?: string | null;
  coverImageWidth?: number | null;
  coverImageHeight?: number | null;
  coverImageBlurDataURL?: string | null;
  createdAt?: any;
  updatedAt?: any;
  publishedAt?: any;
}
