import { useState } from "react";
import { LikeService } from "@/lib/services/like-service";
import { ProductService } from "@/lib/services/product-service";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export function useProductActions() {
  const { user, isLoggedIn } = useAuth();
  const [isLiking, setIsLiking] = useState(false);

  const likeProduct = async (
    productSlug: string,
    isCurrentlyLiked: boolean
  ) => {
    if (!isLoggedIn || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like products",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsLiking(true);

    try {
      if (isCurrentlyLiked) {
        await LikeService.unlikeProduct(user.uid, productSlug);
      } else {
        await LikeService.likeProduct(user.uid, productSlug);
      }

      return { success: true, newLikedState: !isCurrentlyLiked };
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsLiking(false);
    }
  };

  const incrementViews = async (productSlug: string) => {
    try {
      await ProductService.incrementViews(productSlug);
    } catch (error) {
      console.error("Error incrementing views:", error);
      // Don't show error to user for view tracking
    }
  };

  return {
    likeProduct,
    incrementViews,
    isLiking,
  };
}
