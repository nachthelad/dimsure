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
import { normalizeProduct } from "../product-normalizer";
import { generateUrlSlug } from "../utils";

export class ProductService {
  static async create(productData: any, userId: string): Promise<string> {
    if (!userId) {
      throw new Error("User ID is required to create a product");
    }

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
  }

  static async getById(slug: string): Promise<Product | null> {
    try {
      const productDoc = await getDoc(doc(db, "products", slug));
      if (productDoc.exists()) {
        return normalizeProduct(productDoc);
      }
      return null;
    } catch (error) {
      console.error("Error getting product:", error);
      throw error;
    }
  }

  static async getRecent(limitCount = 10): Promise<Product[]> {
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
  }

  static async search(searchTerm: string, limitCount = 10): Promise<Product[]> {
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
  }

  static async incrementViews(productSlug: string): Promise<void> {
    try {
      const productRef = doc(db, "products", productSlug);
      await updateDoc(productRef, {
        views: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  }
}
