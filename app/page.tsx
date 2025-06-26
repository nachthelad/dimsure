"use client"

import { useState, useEffect } from "react"
import { Package, TrendingUp, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { ProductSearch } from "@/components/product-search"
import { getRecentProducts, getDatabaseStats } from "@/lib/firestore"
import { useLanguage } from "@/components/language-provider"
import type { Product } from "@/lib/types"

interface DatabaseStats {
  totalProducts: number
  totalContributions: number
  averageConfidence: number
}

export default function HomePage() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<DatabaseStats>({
    totalProducts: 0,
    totalContributions: 0,
    averageConfidence: 0,
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentProducts, databaseStats] = await Promise.all([getRecentProducts(8), getDatabaseStats()])
        setProducts(recentProducts)
        setStats(databaseStats)
      } catch (error) {
        console.error("Error fetching data:", error)
        setStats({
          totalProducts: 0,
          totalContributions: 0,
          averageConfidence: 0,
        })
      } finally {
        setLoading(false)
        setStatsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
          {t("home.hero.title")}
          <br />
          <span className="text-primary">{t("home.hero.titleHighlight")}</span>
        </h1>
        <p className="text-lg md:text-md text-muted-foreground mb-6 max-w-2xl mx-auto">{t("home.hero.subtitle")}</p>
      </div>

      {/* Stats Cards - compact and above search */}
      <div className="w-full max-w-xl mx-auto flex flex-row justify-center items-center gap-3 mb-3">
        {/* Total Products */}
        <Card className="flex-1 flex flex-col items-center justify-center py-1 px-1 min-w-0">
          {/* Mobile: ícono y número */}
          <div className="flex flex-col items-center w-full md:hidden">
            <Package className="h-5 w-5 text-muted-foreground mb-1" />
            <div className="text-base font-bold p-2">
              {statsLoading ? (
                <div className="h-5 w-8 bg-muted animate-pulse rounded"></div>
              ) : (
                stats.totalProducts.toLocaleString()
              )}
            </div>
          </div>
          {/* Desktop: ícono, texto y número alineados a la izquierda, con más padding */}
          <div className="hidden md:flex flex-row items-center w-full px-4 py-3">
            <div className="flex flex-col flex-1 items-start">
              <CardTitle className="text-xs font-medium mb-1">{t("home.stats.totalProducts")}</CardTitle>
              <div className="text-base font-bold">
                {statsLoading ? (
                  <div className="h-5 w-8 bg-muted animate-pulse rounded"></div>
                ) : (
                  stats.totalProducts.toLocaleString()
                )}
              </div>
            </div>
            <Package className="h-4 w-4 text-muted-foreground ml-2" />
          </div>
        </Card>
        {/* Contributions */}
        <Card className="flex-1 flex flex-col items-center justify-center py-1 px-1 min-w-0">
          <div className="flex flex-col items-center w-full md:hidden">
            <Activity className="h-5 w-5 text-muted-foreground mb-1" />
            <div className="text-base font-bold p-2">
              {statsLoading ? (
                <div className="h-5 w-8 bg-muted animate-pulse rounded"></div>
              ) : (
                stats.totalContributions.toLocaleString()
              )}
            </div>
          </div>
          <div className="hidden md:flex flex-row items-center w-full px-4 py-3">
            <div className="flex flex-col flex-1 items-start">
              <CardTitle className="text-xs font-medium mb-1">{t("home.stats.contributions")}</CardTitle>
              <div className="text-base font-bold">
                {statsLoading ? (
                  <div className="h-5 w-8 bg-muted animate-pulse rounded"></div>
                ) : (
                  stats.totalContributions.toLocaleString()
                )}
              </div>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground ml-2" />
          </div>
        </Card>
        {/* Avg. Confidence */}
        <Card className="flex-1 flex flex-col items-center justify-center py-1 px-1 min-w-0">
          <div className="flex flex-col items-center w-full md:hidden">
            <TrendingUp className="h-5 w-5 text-muted-foreground mb-1" />
            <div className="text-base font-bold p-2">
              {statsLoading ? (
                <div className="h-5 w-8 bg-muted animate-pulse rounded"></div>
              ) : (
                `${stats.averageConfidence}%`
              )}
            </div>
          </div>
          <div className="hidden md:flex flex-row items-center w-full px-4 py-3">
            <div className="flex flex-col flex-1 items-start">
              <CardTitle className="text-xs font-medium mb-1">{t("home.stats.avgConfidence")}</CardTitle>
              <div className="text-base font-bold">
                {statsLoading ? (
                  <div className="h-5 w-8 bg-muted animate-pulse rounded"></div>
                ) : (
                  `${stats.averageConfidence}%`
                )}
              </div>
            </div>
            <TrendingUp className="h-4 w-4 text-muted-foreground ml-2" />
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-10 flex justify-center">
        <div className="w-full max-w-xl">
          <ProductSearch />
        </div>
      </div>

      {/* Recently Added Products */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">{t("home.recentlyAdded.title")}</h2>
          <p className="text-muted-foreground">{t("home.recentlyAdded.subtitle")}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-16 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-1"></div>
                  <div className="h-3 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("home.recentlyAdded.noProducts")}</h3>
              <p className="text-muted-foreground mb-4">{t("home.recentlyAdded.beFirst")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
