"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUnit } from "@/components/layout/unit-provider";
import { useState, useEffect } from "react";
import {
  getConfidenceBadgeVariant,
  getConfidenceDescription,
} from "@/lib/utils/confidence-calculator";
import type { ProductCardData } from "@/lib/interfaces/product.interfaces";
import { useProductActions } from "@/hooks/useProductActions";

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCardImproved({ product }: ProductCardProps) {
  const { getDimensionUnit, convertDimension } = useUnit();
  const { likeProduct, isLiking } = useProductActions();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(product.likes || 0);

  useEffect(() => {
    // This would come from auth context
    const userId = ""; // Get from auth
    if (userId && product.likedBy) {
      setIsLiked(product.likedBy.includes(userId));
    }
  }, [product.likedBy]);

  const formatDimension = (value: number) => {
    const converted = convertDimension(value, "mm");
    return Math.round(converted).toString();
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await likeProduct(product.urlSlug, isLiked);

    if (result.success) {
      setIsLiked(result.newLikedState!);
      setLikesCount((prev) => (result.newLikedState ? prev + 1 : prev - 1));
    }
  };

  return (
    <Link href={`/product/${product.urlSlug}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="relative aspect-square w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <Image
                src={product.mainImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="64px"
                priority={false}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate mb-1">
                {product.name}
              </h3>
              <p className="text-sm font-mono text-primary mb-2 font-medium">
                {product.sku}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <Package className="h-3 w-3" />
                <span>
                  {formatDimension(product.primaryDimensions.length)} ×{" "}
                  {formatDimension(product.primaryDimensions.width)} ×{" "}
                  {formatDimension(product.primaryDimensions.height)}{" "}
                  {getDimensionUnit()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 px-2 ${
                    isLiked ? "text-red-500" : "text-muted-foreground"
                  }`}
                  onClick={handleLike}
                  disabled={isLiking}
                >
                  <Heart
                    className={`h-3 w-3 mr-1 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span>{likesCount}</span>
                </Button>
                <Badge
                  variant={getConfidenceBadgeVariant(product.confidence || 0)}
                  className="text-xs"
                  title={getConfidenceDescription(product.confidence || 0)}
                >
                  {product.confidence !== undefined
                    ? `${product.confidence}%`
                    : "N/A"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
