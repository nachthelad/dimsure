"use client";

import { Package, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/features/product-card";
import { ProductSearch } from "@/components/features/product-search";
import { useLanguage } from "@/components/layout/language-provider";
import type { Product } from "@/lib/types";
import HeroSection from "@/components/features/hero-section";
import { AdSenseAd } from "@/components/features/adsense-ad";

interface DatabaseStats {
  totalProducts: number;
  totalContributions: number;
  averageConfidence: number;
}

interface HomePageClientProps {
  products: Product[];
  stats: DatabaseStats;
}

export function HomePageClient({ products, stats }: HomePageClientProps) {
  const { t } = useLanguage();

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
            {stats.totalProducts.toLocaleString()}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <Activity className="h-4 w-4" />
            {stats.totalContributions.toLocaleString()}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <TrendingUp className="h-4 w-4" />
            {`${stats.averageConfidence}%`}
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
                {stats.totalProducts.toLocaleString()}
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
                {stats.totalContributions.toLocaleString()}
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
                {`${stats.averageConfidence}%`}
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

      {/* Value Proposition Section */}
      <div className="mb-12">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Accurate Measurements</h3>
              <p className="text-sm text-muted-foreground">
                Community-verified product dimensions with confidence scores to
                ensure reliability for your packaging needs.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Cost Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Reduce shipping costs and improve packaging efficiency with
                precise product dimension data.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Community Driven</h3>
              <p className="text-sm text-muted-foreground">
                Join thousands of contributors helping build the most
                comprehensive product dimension database.
              </p>
            </CardContent>
          </Card>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                  {/* Add ad after every 4th product */}
                  {(index + 1) % 4 === 0 && index < products.length - 1 && (
                    <div className="col-span-full my-8">
                      <AdSenseAd
                        adSlotId="8732452191"
                        contentLength={products.length * 200} // Estimate content length
                        minContentLength={800}
                        className="mx-auto"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
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