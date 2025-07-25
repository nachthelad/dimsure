"use client";

import { useState, useEffect } from "react";
import { Package, TrendingUp, Activity, Search } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/features/product-card";
import { ProductSearch } from "@/components/features/product-search";
import { getRecentProducts, getDatabaseStats } from "@/lib/firestore";
import { useLanguage } from "@/components/layout/language-provider";
import type { Product } from "@/lib/types";
import HeroSection from "@/components/features/hero-section";

interface DatabaseStats {
  totalProducts: number;
  totalContributions: number;
  averageConfidence: number;
}

export default function HomePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DatabaseStats>({
    totalProducts: 0,
    totalContributions: 0,
    averageConfidence: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentProducts, databaseStats] = await Promise.all([
          getRecentProducts(8),
          getDatabaseStats(),
        ]);
        setProducts(recentProducts);
        setStats(databaseStats);
      } catch (error) {
        console.error("Error fetching data:", error);
        setStats({
          totalProducts: 0,
          totalContributions: 0,
          averageConfidence: 0,
        });
      } finally {
        setLoading(false);
        setStatsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* Mobile Skeleton */}
        <div className="md:hidden">
          {/* Mobile Title Skeleton */}
          <div className="text-center mb-6">
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="mb-8 flex justify-center">
            <div className="w-full max-w-xl">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="flex justify-center gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </div>

        {/* Desktop Skeleton */}
        <div className="hidden md:block">
          {/* Hero Section Skeleton */}
          <div className="text-center mb-8">
            <div className="mb-3">
              <Skeleton className="h-9 md:h-12 w-80 mx-auto mb-2" />
              <Skeleton className="h-9 md:h-12 w-64 mx-auto" />
            </div>
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="w-full max-w-xl mx-auto flex flex-row justify-center items-center gap-3 mb-3">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="flex-1 flex flex-col items-center justify-center py-1 px-1 min-w-0"
              >
                <div className="flex flex-col items-center w-full">
                  <Skeleton className="h-5 w-5 mb-1" />
                  <Skeleton className="h-6 w-8" />
                </div>
              </Card>
            ))}
          </div>

          {/* Search Bar Skeleton */}
          <div className="mb-10 flex justify-center">
            <div className="w-full max-w-xl">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Products Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full rounded mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      {/* Mobile Layout - Minimalist */}
      <div className="md:hidden">
        {/* Mobile Title - Compact */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-foreground">
            {t("home.hero.title")}
            <span className="text-primary">
              {t("home.hero.titleHighlight")}
            </span>
          </h1>
        </div>

        {/* Search Bar - Prominent placement */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-xl">
            <ProductSearch />
          </div>
        </div>

        {/* Stats - Simplified badges */}
        <div className="flex justify-center gap-4 mb-8">
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <Package className="h-4 w-4" />
            {statsLoading ? (
              <Skeleton className="h-4 w-8" />
            ) : (
              stats.totalProducts.toLocaleString()
            )}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <Activity className="h-4 w-4" />
            {statsLoading ? (
              <Skeleton className="h-4 w-8" />
            ) : (
              stats.totalContributions.toLocaleString()
            )}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <TrendingUp className="h-4 w-4" />
            {statsLoading ? (
              <Skeleton className="h-4 w-8" />
            ) : (
              `${stats.averageConfidence}%`
            )}
          </Badge>
        </div>

        <Separator className="mb-8" />
      </div>

      {/* Desktop Layout - Full experience */}
      <div className="hidden md:block">
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Cards - compact and above search */}
        <div className="w-full max-w-xl mx-auto flex flex-row justify-center items-center gap-3 mb-3">
          {/* Total Products */}
          <Card className="flex-1 flex flex-col items-center justify-center py-1 px-1 min-w-0">
            <div className="flex flex-col items-center w-full">
              <Package className="h-5 w-5 text-muted-foreground mb-1" />
              <div className="text-xs text-muted-foreground mb-1">
                {t("home.stats.totalProducts")}
              </div>
              <div className="text-base font-bold">
                {statsLoading ? (
                  <Skeleton className="h-6 w-8" />
                ) : (
                  stats.totalProducts.toLocaleString()
                )}
              </div>
            </div>
          </Card>
          {/* Contributions */}
          <Card className="flex-1 flex flex-col items-center justify-center py-1 px-1 min-w-0">
            <div className="flex flex-col items-center w-full">
              <Activity className="h-5 w-5 text-muted-foreground mb-1" />
              <div className="text-xs text-muted-foreground mb-1">
                {t("home.stats.contributions")}
              </div>
              <div className="text-base font-bold">
                {statsLoading ? (
                  <Skeleton className="h-6 w-8" />
                ) : (
                  stats.totalContributions.toLocaleString()
                )}
              </div>
            </div>
          </Card>
          {/* Avg. Confidence */}
          <Card className="flex-1 flex flex-col items-center justify-center py-1 px-1 min-w-0">
            <div className="flex flex-col items-center w-full">
              <TrendingUp className="h-5 w-5 text-muted-foreground mb-1" />
              <div className="text-xs text-muted-foreground mb-1">
                {t("home.stats.dataReliability")}
              </div>
              <div className="text-base font-bold">
                {statsLoading ? (
                  <Skeleton className="h-6 w-8" />
                ) : (
                  `${stats.averageConfidence}%`
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-10 flex justify-center">
          <div className="w-full max-w-xl">
            <ProductSearch />
          </div>
        </div>
      </div>

      {/* Recently Added Products - Shared between mobile and desktop */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {t("home.recentlyAdded.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("home.recentlyAdded.subtitle")}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {t("home.recentlyAdded.noProducts")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("home.recentlyAdded.beFirst")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
