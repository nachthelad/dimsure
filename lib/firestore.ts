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
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "./firebase";
import type { Product } from "./types";
import { normalizeProduct } from "./product-normalizer";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { en } from "@/lib/translations/en";
import { es } from "@/lib/translations/es";
import { APP_CONSTANTS } from "./constants";
import { generateUrlSlug } from "./utils";

// Product operations
export const createProduct = async (productData: any, userId: string) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to create a product");
    }

    // Generate unique URL slug
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
};

export const updateProduct = async (
  slug: string,
  productData: any,
  userId: string
) => {
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
};

// Update individual product field
export const updateProductField = async (
  slug: string,
  field: string,
  value: any,
  userId: string
) => {
  try {
    // Handle both slug and sku cases for backward compatibility
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
};

// Image upload functions
export const uploadProductImage = async (
  file: File,
  productSlug: string,
  imageIndex: number
): Promise<string> => {
  try {
    const fileName = `${productSlug}_${imageIndex}_${Date.now()}`;
    const imageRef = ref(storage, `products/${productSlug}/${fileName}`);

    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Evidence image upload function
export const uploadEvidenceImage = async (
  file: File,
  disputeId: string,
  userId: string
): Promise<string> => {
  try {
    const fileName = `evidence_${disputeId}_${userId}_${Date.now()}`;
    const imageRef = ref(storage, `disputes/evidence/${fileName}`);

    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading evidence image:", error);
    throw error;
  }
};

export const updateProductImages = async (
  slug: string,
  images: string[],
  mainImageIndex: number,
  userId: string
) => {
  try {
    const productRef = doc(db, "products", slug);

    const updateData = {
      images,
      mainImage: images[mainImageIndex] || images[0] || "",
      lastModified: serverTimestamp(),
      lastModifiedBy: userId,
    };

    await updateDoc(productRef, updateData);
    return true;
  } catch (error) {
    console.error("Error updating product images:", error);
    throw error;
  }
};

export const deleteProductImage = async (imageUrl: string) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw error - image might already be deleted
  }
};

export const getProduct = async (slug: string): Promise<Product | null> => {
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
};

export const getUserProducts = async (userId: string): Promise<Product[]> => {
  try {
    if (!userId) {
      return [];
    }

    // Simplified query without orderBy to avoid index requirement
    const userProductsQuery = query(
      collection(db, "products"),
      where("createdBy", "==", userId)
    );

    const userProductsSnapshot = await getDocs(userProductsQuery);

    const userProducts = userProductsSnapshot.docs.map(normalizeProduct);

    // Sort by createdAt in JavaScript instead of Firestore
    userProducts.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });

    return userProducts;
  } catch (error) {
    console.error("Error getting user products:", error);

    // Fallback: try to get all products and filter manually
    try {
      const allProductsQuery = query(collection(db, "products"));
      const allProductsSnapshot = await getDocs(allProductsQuery);

      const userProducts = allProductsSnapshot.docs
        .map((doc) => normalizeProduct(doc))
        .filter((product) => product.createdBy === userId)
        .sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(0);
          const bTime = b.createdAt?.toDate?.() || new Date(0);
          return bTime.getTime() - aTime.getTime();
        });

      return userProducts;
    } catch (fallbackError) {
      console.error("Fallback method also failed:", fallbackError);
      return [];
    }
  }
};

export const getRecentProducts = async (
  limitCount = 10
): Promise<Product[]> => {
  try {
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
  } catch (error) {
    console.error("Error getting recent products:", error);
    throw error;
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "approved")
    );
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(normalizeProduct);

    // Sort manually
    return products.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });
  } catch (error) {
    console.error("Error getting all products:", error);
    throw error;
  }
};

export const getAllProductsAdmin = async (): Promise<Product[]> => {
  try {
    const q = query(collection(db, "products"));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(normalizeProduct);
    // Sort manually
    return products.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });
  } catch (error) {
    console.error("Error getting all products (admin):", error);
    throw error;
  }
};

// Search products
export const searchProducts = async (
  searchTerm: string,
  limitCount = 10
): Promise<Product[]> => {
  try {
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
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

// Statistics functions
export const getDatabaseStats = async () => {
  try {
    const productsQuery = query(collection(db, "products"));
    const productsSnapshot = await getDocs(productsQuery);
    const products = productsSnapshot.docs.map((doc) => doc.data());

    const approvedProducts = products.filter((p) => p.status === "approved");
    const totalProducts = approvedProducts.length;

    let totalContributions = 0;
    approvedProducts.forEach((product) => {
      totalContributions += 1;
      if (
        product.lastModifiedBy &&
        product.lastModifiedBy !== product.createdBy
      ) {
        totalContributions += 1;
      }
    });

    let totalConfidence = 0;
    let productsWithConfidence = 0;

    approvedProducts.forEach((product) => {
      if (product.confidence && typeof product.confidence === "number") {
        totalConfidence += product.confidence;
        productsWithConfidence++;
      }
    });

    const averageConfidence =
      productsWithConfidence > 0
        ? Math.round(totalConfidence / productsWithConfidence)
        : 0;

    return {
      totalProducts,
      totalContributions,
      averageConfidence,
    };
  } catch (error) {
    console.error("Error getting database stats:", error);
    return {
      totalProducts: 0,
      totalContributions: 0,
      averageConfidence: 0,
    };
  }
};

// Like operations
export const likeProduct = async (userId: string, productSlug: string) => {
  try {
    const productRef = doc(db, "products", productSlug);
    await updateDoc(productRef, {
      likedBy: arrayUnion(userId),
      likes: increment(1),
    });
  } catch (error) {
    console.error("Error liking product:", error);
    throw error;
  }
};

export const unlikeProduct = async (userId: string, productSlug: string) => {
  try {
    const productRef = doc(db, "products", productSlug);
    await updateDoc(productRef, {
      likedBy: arrayRemove(userId),
      likes: increment(-1),
    });
  } catch (error) {
    console.error("Error unliking product:", error);
  }
};

export const incrementProductViews = async (productSlug: string) => {
  try {
    const productRef = doc(db, "products", productSlug);
    await updateDoc(productRef, {
      views: increment(1),
    });
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
};

// User operations
export const getUserById = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const ensureUserDocument = async (
  userId: string,
  userEmail?: string,
  userDisplayName?: string
) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

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
      });
      return true;
    } else {
      // Update last login for existing users
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      });
    }
    return false;
  } catch (error) {
    console.error("Error ensuring user document:", error);
    throw error;
  }
};

export const updateUserTag = async (
  userId: string,
  publicTag: string,
  userEmail?: string,
  userDisplayName?: string
) => {
  try {
    await ensureUserDocument(userId, userEmail, userDisplayName);
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      publicTag,
      tagLastChanged: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user tag:", error);
    throw error;
  }
};

export const updateUserPreferences = async (
  userId: string,
  preferences: any
) => {
  try {
    await ensureUserDocument(userId);
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      preferences: preferences,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    throw error;
  }
};

export const getUserPreferences = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().preferences || {};
    }
    return {};
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return {};
  }
};

// Account deactivation/reactivation
export const deactivateAccount = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isActive: false,
      deactivatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error deactivating account:", error);
    throw error;
  }
};

export const reactivateAccount = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isActive: true,
      reactivatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error reactivating account:", error);
    throw error;
  }
};

export const checkAccountStatus = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        exists: true,
        isActive: userData.isActive !== false,
        userData,
      };
    }
    return { exists: false, isActive: false, userData: null };
  } catch (error) {
    console.error("Error checking account status:", error);
    return { exists: false, isActive: false, userData: null };
  }
};

// Fix orphan products - assign them to a user
export const fixOrphanProducts = async (userId: string) => {
  try {
    const orphanProductsQuery = query(collection(db, "products"));
    const orphanSnapshot = await getDocs(orphanProductsQuery);

    let fixedCount = 0;

    for (const productDoc of orphanSnapshot.docs) {
      const productData = productDoc.data();

      // If product doesn't have createdBy, assign it to the current user
      if (!productData.createdBy) {
        await updateDoc(doc(db, "products", productDoc.id), {
          createdBy: userId,
          lastModifiedBy: userId,
        });

        fixedCount++;
      }
    }

    return fixedCount;
  } catch (error) {
    console.error("Error fixing orphan products:", error);
    throw error;
  }
};

// Comment operations

// Nuevo: comentarios por producto en subcolección
export const addProductComment = async (
  productSlug: string,
  commentData: any
) => {
  try {
    const commentsRef = collection(
      doc(db, "products", productSlug),
      "comments"
    );
    await addDoc(commentsRef, {
      ...commentData,
      createdAt: serverTimestamp(),
      likes: [],
      dislikes: [],
    });
  } catch (error) {
    console.error("Error adding product comment:", error);
    throw error;
  }
};

export const getProductComments = async (productSlug: string) => {
  try {
    const commentsRef = collection(
      doc(db, "products", productSlug),
      "comments"
    );
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting product comments:", error);
    throw error;
  }
};

export const likeProductComment = async (
  productSlug: string,
  commentId: string,
  userId: string,
  alreadyLiked: boolean
) => {
  try {
    const commentRef = doc(db, "products", productSlug, "comments", commentId);
    if (alreadyLiked) {
      await updateDoc(commentRef, {
        likes: arrayRemove(userId),
      });
    } else {
      await updateDoc(commentRef, {
        likes: arrayUnion(userId),
        dislikes: arrayRemove(userId), // No puede tener ambos
      });
    }
  } catch (error) {
    console.error("Error liking product comment:", error);
    throw error;
  }
};

export const dislikeProductComment = async (
  productSlug: string,
  commentId: string,
  userId: string,
  alreadyDisliked: boolean
) => {
  try {
    const commentRef = doc(db, "products", productSlug, "comments", commentId);
    if (alreadyDisliked) {
      await updateDoc(commentRef, {
        dislikes: arrayRemove(userId),
      });
    } else {
      await updateDoc(commentRef, {
        dislikes: arrayUnion(userId),
        likes: arrayRemove(userId), // No puede tener ambos
      });
    }
  } catch (error) {
    console.error("Error disliking product comment:", error);
    throw error;
  }
};

export const deleteProductComment = async (
  productSlug: string,
  commentId: string
) => {
  try {
    const commentRef = doc(db, "products", productSlug, "comments", commentId);
    await deleteDoc(commentRef);
  } catch (error) {
    console.error("Error deleting product comment:", error);
    throw error;
  }
};

// --- Brand and Category helpers ---

// Busca marcas que coincidan (case-insensitive, empieza por...)
export const searchBrands = async (search: string): Promise<string[]> => {
  const q = query(collection(db, "brands"));
  const snapshot = await getDocs(q);
  const searchLower = search.trim().toLowerCase();
  return snapshot.docs
    .map((doc) => doc.data().name as string)
    .filter((name) => name.toLowerCase().startsWith(searchLower));
};

// Busca categorías que coincidan (case-insensitive, empieza por...)
export const searchCategories = async (search: string): Promise<any[]> => {
  const q = query(collection(db, "categories"));
  const snapshot = await getDocs(q);
  const searchLower = search.trim().toLowerCase();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((cat: any) => {
      // Search in category name and translations
      const nameMatch = cat.name?.toLowerCase().startsWith(searchLower);
      const enMatch = cat.translations?.en
        ?.toLowerCase()
        .startsWith(searchLower);
      const esMatch = cat.translations?.es
        ?.toLowerCase()
        .startsWith(searchLower);
      return nameMatch || enMatch || esMatch;
    });
};

// Obtiene todas las marcas
export const getAllBrands = async (): Promise<string[]> => {
  const q = query(collection(db, "brands"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data().name as string);
};

// Obtiene todas las categorías
export const getAllCategories = async (): Promise<string[]> => {
  const q = query(collection(db, "categories"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data().name as string);
};

// Crea una marca si no existe (case-insensitive)
export const createBrandIfNotExists = async (name: string): Promise<string> => {
  const nameNorm = name.trim();
  const all = await getAllBrands();
  const found = all.find((b) => b.toLowerCase() === nameNorm.toLowerCase());
  if (found) return found; // Devuelve el nombre normalizado existente
  await addDoc(collection(db, "brands"), { name: nameNorm });
  return nameNorm;
};

const enMsg =
  en.myContributions.resolutionPendingNotification ||
  'A dispute for your product "{{productName}}" has reached the required votes. Please edit your product before the time expires, or the community will be able to edit it.';
const esMsg =
  es.myContributions.resolutionPendingNotification ||
  'Una disputa para tu producto "{{productName}}" alcanzó los votos requeridos. Por favor edita tu producto antes de que expire el tiempo, o la comunidad podrá editarlo.';

// Simple translation function for common categories
const getBasicTranslation = (englishName: string): string => {
  const translations: Record<string, string> = {
    gaming: "Juegos",
    accessories: "Accesorios",
    headphones: "Auriculares",
    speakers: "Altavoces",
    cameras: "Cámaras",
    monitors: "Monitores",
    keyboards: "Teclados",
    mice: "Ratones",
    storage: "Almacenamiento",
    networking: "Redes",
    wearables: "Wearables",
    audio: "Audio",
    video: "Video",
    tools: "Herramientas",
    software: "Software",
    toys: "Juguetes",
    sports: "Deportes",
    automotive: "Automotriz",
    home: "Hogar",
    kitchen: "Cocina",
  };

  const lowerName = englishName.toLowerCase();
  return translations[lowerName] || englishName.toLowerCase();
};

// Crea una categoría si no existe (case-insensitive)
export const createCategoryIfNotExists = async (
  name: string
): Promise<string> => {
  try {
    const nameNorm = name.trim();

    // First check if category already exists
    const q = query(collection(db, "categories"));
    const snapshot = await getDocs(q);

    // Check if category exists (case-insensitive)
    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data.name.toLowerCase() === nameNorm.toLowerCase()) {
        return data.name; // Return existing normalized name
      }
    }

    // Create new category with translations
    const spanishTranslation = getBasicTranslation(nameNorm);

    await addDoc(collection(db, "categories"), {
      name: nameNorm,
      translations: {
        en: nameNorm,
        es: spanishTranslation,
      },
      createdAt: serverTimestamp(),
    });

    return nameNorm;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Dispute operations

// Crea una notificación para una disputa
type NotificationMessage = { en: string; es: string };
const createNotificationForDispute = async ({
  userId,
  productId,
  disputeId,
  message,
  status,
}: {
  userId: string;
  productId: string;
  disputeId: string;
  message: NotificationMessage;
  status: string;
}) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      type: "dispute",
      productId,
      disputeId,
      message,
      read: false,
      createdAt: serverTimestamp(),
      status,
    });
  } catch (error) {
    console.error("Error creating notification for dispute:", error);
    // No lanzar error para no interrumpir el flujo principal
  }
};

export const createDispute = async (disputeData: any) => {
  try {
    const disputeRef = await addDoc(collection(db, "disputes"), {
      ...disputeData,
      createdAt: serverTimestamp(),
      votes: {
        upvotes: 0,
        downvotes: 0,
        userVotes: {},
      },
      status: disputeData.status || "open",
    });

    // Obtener el producto relacionado para notificar al creador
    if (disputeData.productSku) {
      try {
        const productDoc = await getDoc(
          doc(db, "products", disputeData.productSku)
        );
        if (productDoc.exists()) {
          const productData = productDoc.data();
          const creatorId = productData.createdBy;
          if (creatorId) {
            await createNotificationForDispute({
              userId: creatorId,
              productId: disputeData.productSku,
              disputeId: disputeRef.id,
              message: {
                en: en.myContributions.disputeNotification.replace(
                  "{{productName}}",
                  productData.name || disputeData.productSku
                ),
                es: es.myContributions.disputeNotification.replace(
                  "{{productName}}",
                  productData.name || disputeData.productSku
                ),
              },
              status: "In Review",
            });
          }
        }
      } catch (error) {
        console.error(
          "Error fetching product for dispute notification:",
          error
        );
      }
    }

    return disputeRef.id;
  } catch (error) {
    console.error("Error creating dispute:", error);
    throw error;
  }
};

export const getDisputes = async () => {
  try {
    const q = query(collection(db, "disputes"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const disputes = [];
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();

      // Get the user's public tag
      let createdByTag = "@unknown";
      if (data.createdBy) {
        try {
          const userRef = doc(db, "users", data.createdBy);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as any;
            createdByTag =
              userData?.publicTag || userData?.displayName || "@unknown";
          }
        } catch (error) {
          console.error("Error getting user data for dispute:", error);
        }
      }

      disputes.push({
        id: docSnapshot.id,
        ...data,
        createdByTag,
      });
    }

    return disputes;
  } catch (error) {
    console.error("Error getting disputes:", error);
    throw error;
  }
};

export const voteOnDispute = async (
  disputeId: string,
  userId: string,
  voteType: "up" | "down"
) => {
  try {
    const disputeRef = doc(db, "disputes", disputeId);
    const disputeDoc = await getDoc(disputeRef);
    if (!disputeDoc.exists()) {
      throw new Error("Dispute not found");
    }
    const data = disputeDoc.data();
    const currentVotes = data.votes || {
      upvotes: 0,
      downvotes: 0,
      userVotes: {},
    };
    const userVotes = currentVotes.userVotes || {};
    const previousVote = userVotes[userId];
    // Remove previous vote if exists
    if (previousVote === "up") {
      currentVotes.upvotes = Math.max(0, currentVotes.upvotes - 1);
    } else if (previousVote === "down") {
      currentVotes.downvotes = Math.max(0, currentVotes.downvotes - 1);
    }
    // Add new vote if different from previous or no previous vote
    if (previousVote !== voteType) {
      if (voteType === "up") {
        currentVotes.upvotes += 1;
      } else {
        currentVotes.downvotes += 1;
      }
      userVotes[userId] = voteType;
    } else {
      // Remove vote if clicking same vote type
      delete userVotes[userId];
    }
    currentVotes.userVotes = userVotes;
    // Calcular porcentaje y total de votos
    const upvotes = currentVotes.upvotes;
    const downvotes = currentVotes.downvotes;
    const totalVotes = upvotes + downvotes;
    const positiveRatio = totalVotes > 0 ? upvotes / totalVotes : 0;
    let updateData: any = { votes: currentVotes };
    // Si cumple el umbral y no hay resolutionPendingAt, marcar y notificar
    if (
      positiveRatio >= 0.7 &&
      totalVotes >= APP_CONSTANTS.MIN_DISPUTE_VOTES &&
      !data.resolutionPendingAt
    ) {
      updateData.resolutionPendingAt = serverTimestamp();
      updateData.status = "in_review"; // Cambia automáticamente a in_review
      // Notificar al creador del producto
      if (data.productSku) {
        try {
          const productDoc = await getDoc(doc(db, "products", data.productSku));
          if (productDoc.exists()) {
            const productData = productDoc.data();
            const creatorId = productData.createdBy;
            if (creatorId) {
              await createNotificationForDispute({
                userId: creatorId,
                productId: data.productSku,
                disputeId: disputeId,
                message: {
                  en: enMsg.replace(
                    "{{productName}}",
                    productData.name || data.productSku
                  ),
                  es: esMsg.replace(
                    "{{productName}}",
                    productData.name || data.productSku
                  ),
                },
                status: "Resolution Pending",
              });
            }
          }
        } catch (error) {
          console.error(
            "Error fetching product for dispute notification:",
            error
          );
        }
      }
    }
    // Si recibe mayoría de votos negativos, pasar a 'rejected'
    if (
      positiveRatio < 0.3 &&
      totalVotes >= APP_CONSTANTS.MIN_DISPUTE_VOTES &&
      data.status !== "rejected"
    ) {
      updateData.status = "rejected";
    }
    await updateDoc(disputeRef, updateData);
  } catch (error) {
    console.error("Error voting on dispute:", error);
    throw error;
  }
};

export const updateDisputeStatus = async (
  disputeId: string,
  status: string,
  resolution?: any
) => {
  try {
    const disputeRef = doc(db, "disputes", disputeId);
    const updateData: any = {
      status,
      lastModified: serverTimestamp(),
    };

    if (resolution) {
      updateData.resolution = {
        ...resolution,
        resolvedAt: serverTimestamp(),
      };
    }

    await updateDoc(disputeRef, updateData);
  } catch (error) {
    console.error("Error updating dispute status:", error);
    throw error;
  }
};

// Obtiene las notificaciones de un usuario ordenadas por fecha descendente
export const getUserNotifications = async (userId: string) => {
  try {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting user notifications:", error);
    return [];
  }
};

// Obtener disputas de un producto por slug
export const getProductDisputes = async (productSlug: string) => {
  try {
    const q = query(
      collection(db, "disputes"),
      where("productSku", "==", productSlug)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting product disputes:", error);
    return [];
  }
};
