import type { Product } from "../types";
import type { ServiceResult } from "../types/service-result";

export interface ProductRepository {
  create(productData: any, userId: string): Promise<ServiceResult<string>>;
  getById(id: string): Promise<ServiceResult<Product | null>>;
  getRecent(limit?: number): Promise<ServiceResult<Product[]>>;
  search(searchTerm: string, limit?: number): Promise<ServiceResult<Product[]>>;
  update(
    id: string,
    productData: any,
    userId: string
  ): Promise<ServiceResult<void>>;
  delete(id: string): Promise<ServiceResult<void>>;
  incrementViews(id: string): Promise<ServiceResult<void>>;
}
