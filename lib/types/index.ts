// Re-export all types from their respective modules
export * from "./product";
export * from "./user";

// Common types
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

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form types
export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: any;
  read: boolean;
  actionUrl?: string;
}

// Search types
export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  filters?: Record<string, any>;
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}
