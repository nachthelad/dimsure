export interface Product {
  id: string
  name: string
  sku: string
  brand?: string
  category?: string
  primaryDimensions: { length: number; width: number; height: number }
  likes?: number
  confidence?: number
  mainImage?: string
  likedBy?: string[]
  images?: string[]
  views?: number
  description?: string
  createdBy?: string
  lastModifiedBy?: string
  lastModified?: any
  createdAt?: any
  specifications?: Record<string, any>
  status?: 'approved' | 'pending' | 'rejected'
  moderationResults?: any[];
}
