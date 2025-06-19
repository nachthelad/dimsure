"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Package, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useUnit } from "./unit-provider"
import { useAuth } from "@/hooks/useAuth"
import { likeProduct, unlikeProduct } from "@/lib/firestore"
import { useState, useEffect } from "react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    sku: string
    primaryDimensions: { length: number; width: number; height: number }
    likes: number
    confidence: number
    mainImage: string
    likedBy?: string[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { unit, convertDimension } = useUnit()
  const { user, isLoggedIn } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(product.likes || 0)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    if (user && product.likedBy) {
      setIsLiked(product.likedBy.includes(user.uid))
    }
  }, [user, product.likedBy])

  const formatDimension = (value: number) => {
    const converted = convertDimension(value, "mm")
    return Math.round(converted).toString()
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation()

    if (!isLoggedIn || !user) {
      alert("Please sign in to like products")
      return
    }

    setIsLiking(true)

    try {
      if (isLiked) {
        await unlikeProduct(user.uid, product.sku)
        setIsLiked(false)
        setLikesCount((prev) => prev - 1)
      } else {
        await likeProduct(user.uid, product.sku)
        setIsLiked(true)
        setLikesCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Link href={`/product/${product.sku}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Image
              src={product.mainImage || "/placeholder.svg"}
              alt={product.name}
              width={60}
              height={60}
              className="rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate mb-1">{product.name}</h3>
              <p className="text-sm font-mono text-primary mb-2 font-medium">{product.sku}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <Package className="h-3 w-3" />
                <span>
                  {formatDimension(product.primaryDimensions.length)} ×{" "}
                  {formatDimension(product.primaryDimensions.width)} ×{" "}
                  {formatDimension(product.primaryDimensions.height)} {unit}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 px-2 ${isLiked ? "text-red-500" : "text-muted-foreground"}`}
                  onClick={handleLike}
                  disabled={isLiking}
                >
                  <Heart className={`h-3 w-3 mr-1 ${isLiked ? "fill-current" : ""}`} />
                  <span>{likesCount}</span>
                </Button>
                <Badge
                  variant={product.confidence >= 90 ? "default" : "secondary"}
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  {product.confidence}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
