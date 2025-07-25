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
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Product } from "../types";
import { normalizeProduct } from "../product-normalizer";
import { generateUrlSlug } from "../utils";

export class ProductService {
  // Create product
  static async createProduct(
    productData: any,
    userId: string
  ): Promise<string> {
    try {
      if (!userId) {
        throw new Error("User ID is required to create a product");
      }

      const urlSlug = generateUrlSlug(productData.sku);
      const productRef = doc(db, "products", urlSlug);

      // Check if product already exists
      const existingProduct = await getDoc(productRef);
      if (existingProduct.exists()) {
        throw new Error(`Product with SKU ${productData.sku} already exists`);
      }

      const productToSave = {
        ...productData,
        urlSlug, // Store the URL slug
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
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(
    slug: string,
    productData: any,
    userId: string
  ): Promise<string> {
    try {
      const productRef = doc(db, "products", slug);

      await updateDoc(productRef, {
        ...productData,
        lastModified: serverTimestamp(),
        lastModifiedBy: userId,
      });

      return slug;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  // Update individual product field
  static async updateProductField(
    slug: string,
    field: string,
    value: any,
    userId: string
  ): Promise<boolean> {
    try {
      const productRef = doc(db, "products", slug);

      const updateData: any = {
        [field]: value,
        lastModified: serverTimestamp(),
        lastModifiedBy: userId,
      };

      await updateDoc(productRef, updateData);
      return true;
    } catch (error) {
      console.error(`Error updating product field ${field}:`, error);
      throw error;
    }
  }

  // Get product by slug
  static async getProduct(slug: string): Promise<Product | null> {
    try {
      const productRef = doc(db, "products", slug);
      const productDoc = await getDoc(productRef);

      if (productDoc.exists()) {
        return normalizeProduct({
          id: productDoc.id,
          ...productDoc.data(),
        });
      }

      return null;
    } catch (error) {
      console.error("Error getting product:", error);
      throw error;
    }
  }

  // Get user products
  static async getUserProducts(userId: string): Promise<Product[]> {
    try {
      const productsRef = collection(db, "products");
      const q = query(
        productsRef,
        where("createdBy", "==", userId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const productData = doc.data();
        products.push(normalizeProduct({ id: doc.id, ...productData }));
      });

      return products;
    } catch (error) {
      console.error("Error getting user products:", error);
      throw error;
    }
  }

  // Get recent products
  static async getRecentProducts(limitCount = 10): Promise<Product[]> {
    try {
      const productsRef = collection(db, "products");
      const q = query(
        productsRef,
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const productData = doc.data();
        products.push(normalizeProduct({ id: doc.id, ...productData }));
      });

      return products;
    } catch (error) {
      console.error("Error getting recent products:", error);
      throw error;
    }
  }

  // Search products
  static async searchProducts(
    searchTerm: string,
    limitCount = 10
  ): Promise<Product[]> {
    try {
      const productsRef = collection(db, "products");
      const q = query(
        productsRef,
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff"),
        orderBy("name"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const productData = doc.data();
        products.push(normalizeProduct({ id: doc.id, ...productData }));
      });

      return products;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }

  // Like product
  static async likeProduct(userId: string, productSlug: string): Promise<void> {
    try {
      const productRef = doc(db, "products", productSlug);
      await updateDoc(productRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId),
      });
    } catch (error) {
      console.error("Error liking product:", error);
      throw error;
    }
  }

  // Unlike product
  static async unlikeProduct(
    userId: string,
    productSlug: string
  ): Promise<void> {
    try {
      const productRef = doc(db, "products", productSlug);
      await updateDoc(productRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId),
      });
    } catch (error) {
      console.error("Error unliking product:", error);
      throw error;
    }
  }

  // Increment product views
  static async incrementProductViews(productSlug: string): Promise<void> {
    try {
      const productRef = doc(db, "products", productSlug);
      await updateDoc(productRef, {
        views: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing product views:", error);
      throw error;
    }
  }
}
