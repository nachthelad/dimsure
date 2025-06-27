import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Product } from "./types"
import { normalizeProduct } from "./product-normalizer"

// Product operations
export const createProduct = async (productData: any, userId: string) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to create a product")
    }

    const productRef = doc(db, "products", productData.sku)

    // Check if product already exists
    const existingProduct = await getDoc(productRef)
    if (existingProduct.exists()) {
      throw new Error(`Product with SKU ${productData.sku} already exists`)
    }

    const productToSave = {
      ...productData,
      createdAt: serverTimestamp(),
      createdBy: userId,
      lastModified: serverTimestamp(),
      lastModifiedBy: userId,
      likes: 0,
      views: 0,
      confidence: 85,
      alternativesCount: 0,
      likedBy: [],
    }

    await setDoc(productRef, productToSave)

    return productData.sku
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export const updateProduct = async (sku: string, productData: any, userId: string) => {
  try {
    const productRef = doc(db, "products", sku)

    await updateDoc(productRef, {
      ...productData,
      lastModified: serverTimestamp(),
      lastModifiedBy: userId,
    })

    return sku
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export const getProduct = async (sku: string): Promise<Product | null> => {
  try {
    const productDoc = await getDoc(doc(db, "products", sku))
    if (productDoc.exists()) {
      return normalizeProduct(productDoc)
    }
    return null
  } catch (error) {
    console.error("Error getting product:", error)
    throw error
  }
}

export const getUserProducts = async (userId: string): Promise<Product[]> => {
  try {
    if (!userId) {
      return []
    }

    // Simplified query without orderBy to avoid index requirement
    const userProductsQuery = query(collection(db, "products"), where("createdBy", "==", userId))

    const userProductsSnapshot = await getDocs(userProductsQuery)

    const userProducts = userProductsSnapshot.docs.map(normalizeProduct)

    // Sort by createdAt in JavaScript instead of Firestore
    userProducts.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0)
      const bTime = b.createdAt?.toDate?.() || new Date(0)
      return bTime.getTime() - aTime.getTime()
    })

    return userProducts
  } catch (error) {
    console.error("Error getting user products:", error)

    // Fallback: try to get all products and filter manually
    try {
      const allProductsQuery = query(collection(db, "products"))
      const allProductsSnapshot = await getDocs(allProductsQuery)

      const userProducts = allProductsSnapshot.docs
        .map((doc) => normalizeProduct(doc))
        .filter((product) => product.createdBy === userId)
        .sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(0)
          const bTime = b.createdAt?.toDate?.() || new Date(0)
          return bTime.getTime() - aTime.getTime()
        })

      return userProducts
    } catch (fallbackError) {
      console.error("Fallback method also failed:", fallbackError)
      return []
    }
  }
}

export const getRecentProducts = async (limitCount = 10): Promise<Product[]> => {
  try {
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(limitCount))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(normalizeProduct) as Product[]
    } catch (error) {
      const q = query(collection(db, "products"), limit(50))
      const querySnapshot = await getDocs(q)
      const products = querySnapshot.docs.map(normalizeProduct)
      return products
        .sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(0)
          const bTime = b.createdAt?.toDate?.() || new Date(0)
          return bTime.getTime() - aTime.getTime()
        })
        .slice(0, limitCount) as Product[]
    }
  } catch (error) {
    console.error("Error getting recent products:", error)
    throw error
  }
}

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const q = query(collection(db, "products"))
    const querySnapshot = await getDocs(q)
    const products = querySnapshot.docs.map(normalizeProduct)

    // Sort manually
    return products.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0)
      const bTime = b.createdAt?.toDate?.() || new Date(0)
      return bTime.getTime() - aTime.getTime()
    })
  } catch (error) {
    console.error("Error getting all products:", error)
    throw error
  }
}

// Search products
export const searchProducts = async (searchTerm: string, limitCount = 10): Promise<Product[]> => {
  try {
    if (!searchTerm.trim()) {
      return []
    }

    const q = query(collection(db, "products"), limit(50))
    const querySnapshot = await getDocs(q)

    const allProducts = querySnapshot.docs.map(normalizeProduct)

    const searchTermLower = searchTerm.toLowerCase()
    const filteredProducts = allProducts.filter((product) => {
      return (
        product.name?.toLowerCase().includes(searchTermLower) ||
        product.sku?.toLowerCase().includes(searchTermLower) ||
        product.brand?.toLowerCase().includes(searchTermLower) ||
        product.category?.toLowerCase().includes(searchTermLower)
      )
    })

    return filteredProducts.slice(0, limitCount) as Product[]
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}

// Statistics functions
export const getDatabaseStats = async () => {
  try {
    const productsQuery = query(collection(db, "products"))
    const productsSnapshot = await getDocs(productsQuery)
    const products = productsSnapshot.docs.map((doc) => doc.data())

    const totalProducts = products.length

    let totalContributions = 0
    products.forEach((product) => {
      totalContributions += 1
      if (product.lastModifiedBy && product.lastModifiedBy !== product.createdBy) {
        totalContributions += 1
      }
    })

    let totalConfidence = 0
    let productsWithConfidence = 0

    products.forEach((product) => {
      if (product.confidence && typeof product.confidence === "number") {
        totalConfidence += product.confidence
        productsWithConfidence++
      }
    })

    const averageConfidence = productsWithConfidence > 0 ? Math.round(totalConfidence / productsWithConfidence) : 0

    return {
      totalProducts,
      totalContributions,
      averageConfidence,
    }
  } catch (error) {
    console.error("Error getting database stats:", error)
    return {
      totalProducts: 0,
      totalContributions: 0,
      averageConfidence: 0,
    }
  }
}

// Like operations
export const likeProduct = async (userId: string, productSku: string) => {
  try {
    const productRef = doc(db, "products", productSku)
    await updateDoc(productRef, {
      likedBy: arrayUnion(userId),
      likes: increment(1),
    })
  } catch (error) {
    console.error("Error liking product:", error)
    throw error
  }
}

export const unlikeProduct = async (userId: string, productSku: string) => {
  try {
    const productRef = doc(db, "products", productSku)
    await updateDoc(productRef, {
      likedBy: arrayRemove(userId),
      likes: increment(-1),
    })
  } catch (error) {
    console.error("Error unliking product:", error)
  }
}

export const incrementProductViews = async (productSku: string) => {
  try {
    const productRef = doc(db, "products", productSku)
    await updateDoc(productRef, {
      views: increment(1),
    })
  } catch (error) {
    console.error("Error incrementing views:", error)
  }
}

// User operations
export const getUserById = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return userDoc.data()
    }
    return null
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export const ensureUserDocument = async (userId: string, userEmail?: string, userDisplayName?: string) => {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: userId,
        email: userEmail || null,
        displayName: userDisplayName || null,
        publicTag: null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        reputation: 0,
        contributionsCount: 0,
        isVerified: false,
        isActive: true,
        preferences: {},
      })
      return true
    } else {
      // Update last login for existing users
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      })
    }
    return false
  } catch (error) {
    console.error("Error ensuring user document:", error)
    throw error
  }
}

export const updateUserTag = async (
  userId: string,
  publicTag: string,
  userEmail?: string,
  userDisplayName?: string,
) => {
  try {
    await ensureUserDocument(userId, userEmail, userDisplayName)
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      publicTag,
      tagLastChanged: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user tag:", error)
    throw error
  }
}

export const updateUserPreferences = async (userId: string, preferences: any) => {
  try {
    await ensureUserDocument(userId)
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      preferences: preferences,
      lastUpdated: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user preferences:", error)
    throw error
  }
}

export const getUserPreferences = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      return userDoc.data().preferences || {}
    }
    return {}
  } catch (error) {
    console.error("Error getting user preferences:", error)
    return {}
  }
}

// Account deactivation/reactivation
export const deactivateAccount = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      isActive: false,
      deactivatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error deactivating account:", error)
    throw error
  }
}

export const reactivateAccount = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      isActive: true,
      reactivatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error reactivating account:", error)
    throw error
  }
}

export const checkAccountStatus = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return {
        exists: true,
        isActive: userData.isActive !== false,
        userData,
      }
    }
    return { exists: false, isActive: false, userData: null }
  } catch (error) {
    console.error("Error checking account status:", error)
    return { exists: false, isActive: false, userData: null }
  }
}

// Fix orphan products - assign them to a user
export const fixOrphanProducts = async (userId: string) => {
  try {
    const orphanProductsQuery = query(collection(db, "products"))
    const orphanSnapshot = await getDocs(orphanProductsQuery)

    let fixedCount = 0

    for (const productDoc of orphanSnapshot.docs) {
      const productData = productDoc.data()

      // If product doesn't have createdBy, assign it to the current user
      if (!productData.createdBy) {
        await updateDoc(doc(db, "products", productDoc.id), {
          createdBy: userId,
          lastModifiedBy: userId,
        })

        fixedCount++
      }
    }

    return fixedCount
  } catch (error) {
    console.error("Error fixing orphan products:", error)
    throw error
  }
}

// Comment operations
export const addComment = async (commentData: any) => {
  try {
    await addDoc(collection(db, "comments"), {
      ...commentData,
      createdAt: serverTimestamp(),
      likes: 0,
      isEdited: false,
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    throw error
  }
}

export const getProductComments = async (productSku: string) => {
  try {
    const q = query(collection(db, "comments"), where("productSku", "==", productSku), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting comments:", error)
    throw error
  }
}

// --- Brand and Category helpers ---

// Busca marcas que coincidan (case-insensitive, empieza por...)
export const searchBrands = async (search: string): Promise<string[]> => {
  const q = query(collection(db, "brands"));
  const snapshot = await getDocs(q);
  const searchLower = search.trim().toLowerCase();
  return snapshot.docs
    .map(doc => doc.data().name as string)
    .filter(name => name.toLowerCase().startsWith(searchLower));
};

// Busca categorías que coincidan (case-insensitive, empieza por...)
export const searchCategories = async (search: string): Promise<any[]> => {
  const q = query(collection(db, "categories"));
  const snapshot = await getDocs(q);
  const searchLower = search.trim().toLowerCase();
  return snapshot.docs
    .map(doc => doc.data())
    .filter(cat => cat.name.toLowerCase().startsWith(searchLower));
};

// Obtiene todas las marcas
export const getAllBrands = async (): Promise<string[]> => {
  const q = query(collection(db, "brands"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().name as string);
};

// Obtiene todas las categorías
export const getAllCategories = async (): Promise<string[]> => {
  const q = query(collection(db, "categories"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().name as string);
};

// Crea una marca si no existe (case-insensitive)
export const createBrandIfNotExists = async (name: string): Promise<string> => {
  const nameNorm = name.trim();
  const all = await getAllBrands();
  const found = all.find(b => b.toLowerCase() === nameNorm.toLowerCase());
  if (found) return found; // Devuelve el nombre normalizado existente
  await addDoc(collection(db, "brands"), { name: nameNorm });
  return nameNorm;
};

// Crea una categoría si no existe (case-insensitive)
export const createCategoryIfNotExists = async (name: string): Promise<string> => {
  const nameNorm = name.trim();
  const all = await getAllCategories();
  const found = all.find(c => c.toLowerCase() === nameNorm.toLowerCase());
  if (found) return found;
  await addDoc(collection(db, "categories"), { name: nameNorm });
  return nameNorm;
};
