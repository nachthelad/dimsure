import {
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";

export class LikeService {
  static async likeProduct(userId: string, productSlug: string): Promise<void> {
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
  }

  static async unlikeProduct(
    userId: string,
    productSlug: string
  ): Promise<void> {
    try {
      const productRef = doc(db, "products", productSlug);
      await updateDoc(productRef, {
        likedBy: arrayRemove(userId),
        likes: increment(-1),
      });
    } catch (error) {
      console.error("Error unliking product:", error);
      throw error;
    }
  }
}
