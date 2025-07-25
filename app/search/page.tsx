"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/features/product-card";
import { searchProducts, getAllProducts } from "@/lib/firestore";
import { useUnit } from "@/components/layout/unit-provider";
import { useLanguage } from "@/components/layout/language-provider";
import { useDebounce } from "@/hooks/use-debounce";
import { APP_CONSTANTS } from "@/lib/constants";
import type { Product } from "@/lib/types";

type ViewMode = "grid" | "list" | "table";
type SortOption = "name" | "date" | "brand";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filters, setFilters] = useState({
    brand: "all",
    category: "all",
    minLength: "",
    maxLength: "",
    minWidth: "",
    maxWidth: "",
    minHeight: "",
    maxHeight: "",
  });
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { t } = useLanguage();
  const { getDimensionUnit, convertDimension } = useUnit();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load all products for filtering
  useEffect(() => {
    const loadProducts = async () => {
      setInitialLoading(true);
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);

        // Extract unique brands and categories
        const uniqueBrands = [
          ...new Set(
            allProducts
              .map((p) => p.brand)
              .filter((brand): brand is string => Boolean(brand))
          ),
        ].sort();
        const uniqueCategories = [
          ...new Set(
            allProducts
              .map((p) => p.category)
              .filter((category): category is string => Boolean(category))
          ),
        ].sort();

        setBrands(uniqueBrands);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Search and filter products
  useEffect(() => {
    const searchAndFilter = async () => {
      setLoading(true);
      try {
        let results: Product[] = [];

        if (debouncedSearchTerm.trim()) {
          // Search by term
          results = await searchProducts(
            debouncedSearchTerm,
            APP_CONSTANTS.MAX_SEARCH_RESULTS
          );
        } else {
          // Show all products
          results = products;
        }

        // Apply filters
        let filtered = results.filter((product) => {
          if (
            filters.brand &&
            filters.brand !== "all" &&
            product.brand !== filters.brand
          )
            return false;
          if (
            filters.category &&
            filters.category !== "all" &&
            product.category !== filters.category
          )
            return false;

          // Dimension filters
          const length = convertDimension(
            product.primaryDimensions.length,
            "mm"
          );
          const width = convertDimension(product.primaryDimensions.width, "mm");
          const height = convertDimension(
            product.primaryDimensions.height,
            "mm"
          );

          if (filters.minLength && length < parseFloat(filters.minLength))
            return false;
          if (filters.maxLength && length > parseFloat(filters.maxLength))
            return false;
          if (filters.minWidth && width < parseFloat(filters.minWidth))
            return false;
          if (filters.maxWidth && width > parseFloat(filters.maxWidth))
            return false;
          if (filters.minHeight && height < parseFloat(filters.minHeight))
            return false;
          if (filters.maxHeight && height > parseFloat(filters.maxHeight))
            return false;

          return true;
        });

        // Sort results
        filtered = sortProducts(filtered, sortBy);

        // Limit to 20 products
        filtered = filtered.slice(0, 20);

        setFilteredProducts(filtered);
      } catch (error) {
        console.error("Search error:", error);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    searchAndFilter();
  }, [debouncedSearchTerm, filters, sortBy, products, convertDimension]);

  const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "brand":
          return (a.brand || "").localeCompare(b.brand || "");
        case "date":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      brand: "all",
      category: "all",
      minLength: "",
      maxLength: "",
      minWidth: "",
      maxWidth: "",
      minHeight: "",
      maxHeight: "",
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "brand" || key === "category") {
      return value !== "all" && value !== "";
    }
    return value !== "";
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("search.title")}</h1>
        <p className="text-muted-foreground">{t("search.subtitle")}</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t("search.placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 mb-6">
        {/* First row: Sort and View Mode */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sort */}
          <Select
            value={sortBy}
            onValueChange={(value: SortOption) => setSortBy(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("search.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{t("search.sort.name")}</SelectItem>
              <SelectItem value="brand">{t("search.sort.brand")}</SelectItem>
              <SelectItem value="date">{t("search.sort.date")}</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Second row: Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Filter button clicked, current state:", showFilters);
            setShowFilters(!showFilters);
          }}
          className="self-start"
        >
          <Filter className="h-4 w-4 mr-2" />
          {t("search.filters")}
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              {
                Object.entries(filters).filter(([key, value]) => {
                  if (key === "brand" || key === "category") {
                    return value !== "all" && value !== "";
                  }
                  return value !== "";
                }).length
              }
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {t("search.advancedFilters")}
              </h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {t("search.clearFilters")}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Brand Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("search.filterOptions.brand")}
                </label>
                <Select
                  value={filters.brand}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, brand: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("search.filterOptions.allBrands")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("search.filterOptions.allBrands")}
                    </SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("search.filterOptions.category")}
                </label>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("search.filterOptions.allCategories")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("search.filterOptions.allCategories")}
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Length Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("search.filterOptions.length")} ({getDimensionUnit()})
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    value={filters.minLength}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minLength: e.target.value,
                      }))
                    }
                    className="text-sm"
                  />
                  <Input
                    placeholder="Max"
                    value={filters.maxLength}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxLength: e.target.value,
                      }))
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Width Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("search.filterOptions.width")} ({getDimensionUnit()})
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    value={filters.minWidth}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minWidth: e.target.value,
                      }))
                    }
                    className="text-sm"
                  />
                  <Input
                    placeholder="Max"
                    value={filters.maxWidth}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxWidth: e.target.value,
                      }))
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Height Range */}
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">
                {t("search.filterOptions.height")} ({getDimensionUnit()})
              </label>
              <div className="flex gap-2 max-w-xs">
                <Input
                  placeholder="Min"
                  value={filters.minHeight}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minHeight: e.target.value,
                    }))
                  }
                  className="text-sm"
                />
                <Input
                  placeholder="Max"
                  value={filters.maxHeight}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxHeight: e.target.value,
                    }))
                  }
                  className="text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading || initialLoading
              ? t("search.searching")
              : `${filteredProducts.length} ${t("search.resultsCount")}`}
          </p>
          {!loading && !initialLoading && filteredProducts.length === 20 && (
            <p className="text-xs text-muted-foreground">
              {t("search.showingFirst20")}
            </p>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      {loading || initialLoading ? (
        <>
          {/* Mobile Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-24 bg-muted rounded-lg mb-3"></div>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-2 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Skeleton */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : !initialLoading && filteredProducts.length > 0 ? (
        <>
          {/* Mobile Grid - Always grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Desktop Grid/List - Respects view mode */}
          <div
            className={
              viewMode === "grid"
                ? "hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "hidden md:block space-y-4"
            }
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : !initialLoading ? (
        <Card className="p-12 text-center">
          <CardContent>
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? t("search.noResults") : t("search.noProducts")}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm ? t("search.tryDifferent") : t("search.beFirst")}
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
