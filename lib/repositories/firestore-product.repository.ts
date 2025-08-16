import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Product } from "../types";
import type { ServiceResult } from "../types/service-result";
import { BaseService } from "../services/base-service";
import { normalizeProduct } from "../product-normalizer";
import { generateUrlSlug } from "../utils";
import type { ProductRepository } from "./product.repository.interface";

export class FirestoreProductRepository
  extends BaseService
  implements ProductRepository
{
  async create(
    productData: any,
    userId: string
  ): Promise<ServiceResult<string>> {
    return this.executeWithErrorHandling(async () => {
      this.validateRequired(userId, "User ID");
      this.validateRequired(productData.sku, "Product SKU");

      const urlSlug = generateUrlSlug(productData.sku);
      const productRef = doc(db, "products", urlSlug);

      const existingProduct = await getDoc(productRef);
      if (existingProduct.exists()) {
        throw new Error(`Product with SKU ${productData.sku} already exists`);
      }

      const productToSave = {
        ...productData,
        urlSlug,
        createdAt: serverTimestamp(),
        createdBy: userId,
        lastModified: serverTimestamp(),
        lastModifiedBy: userId,
        likes: 0,
        views: 0,
        confidence: 85,
        alternativesCount: 0,
        likedBy: [],
      };

      await setDoc(productRef, productToSave);
      return productData.sku;
    }, "Error creating product");
  }

  async getById(id: string): Promise<ServiceResult<Product | null>> {
    return this.executeWithErrorHandling(async () => {
      this.validateRequired(id, "Product ID");

      const productDoc = await getDoc(doc(db, "products", id));
      if (productDoc.exists()) {
        return normalizeProduct(productDoc);
      }
      return null;
    }, "Error getting product");
  }

  async getRecent(limitCount = 10): Promise<ServiceResult<Product[]>> {
    return this.executeWithErrorHandling(async () => {
      try {
        const q = query(
          collection(db, "products"),
          where("status", "==", "approved"),
          orderBy("createdAt", "desc"),
          limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(normalizeProduct) as Product[];
      } catch (error) {
        // Fallback without orderBy
        const q = query(
          collection(db, "products"),
          where("status", "==", "approved"),
          limit(50)
        );
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(normalizeProduct);
        return products
          .sort((a, b) => {
            const aTime = a.createdAt?.toDate?.() || new Date(0);
            const bTime = b.createdAt?.toDate?.() || new Date(0);
            return bTime.getTime() - aTime.getTime();
          })
          .slice(0, limitCount) as Product[];
      }
    }, "Error getting recent products");
  }

  async search(
    searchTerm: string,
    limitCount = 10
  ): Promise<ServiceResult<Product[]>> {
    return this.executeWithErrorHandling(async () => {
      if (!searchTerm.trim()) {
        return [];
      }

      const q = query(
        collection(db, "products"),
        where("status", "==", "approved"),
        limit(50)
      );
      const querySnapshot = await getDocs(q);

      const allProducts = querySnapshot.docs.map(normalizeProduct);
      const searchTermLower = searchTerm.toLowerCase();

      const filteredProducts = allProducts.filter((product) => {
        return (
          product.name?.toLowerCase().includes(searchTermLower) ||
          product.sku?.toLowerCase().includes(searchTermLower) ||
          product.brand?.toLowerCase().includes(searchTermLower) ||
          product.category?.toLowerCase().includes(searchTermLower)
        );
      });

      return filteredProducts.slice(0, limitCount) as Product[];
    }, "Error searching products");
  }

  async update(
    id: string,
    productData: any,
    userId: string
  ): Promise<ServiceResult<void>> {
    return this.executeWithErrorHandling(async () => {
      this.validateRequired(id, "Product ID");
      this.validateRequired(userId, "User ID");

      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        ...productData,
        lastModified: serverTimestamp(),
        lastModifiedBy: userId,
      });
    }, "Error updating product");
  }

  async delete(id: string): Promise<ServiceResult<void>> {
    return this.executeWithErrorHandling(async () => {
      this.validateRequired(id, "Product ID");
      // Implementation would go here
      throw new Error("Delete operation not implemented");
    }, "Error deleting product");
  }

  async incrementViews(id: string): Promise<ServiceResult<void>> {
    return this.executeWithErrorHandling(async () => {
      this.validateRequired(id, "Product ID");

      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        views: increment(1),
      });
    }, "Error incrementing views");
  }
}
