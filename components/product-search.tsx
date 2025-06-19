"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { searchProducts } from "@/lib/firestore"
import { useUnit } from "./unit-provider"
import { useLanguage } from "./language-provider"

interface Product {
  id: string
  name: string
  sku: string
  brand: string
  category: string
  primaryDimensions: { length: number; width: number; height: number }
}

export function ProductSearch() {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { unit, convertDimension } = useUnit()
  const { t } = useLanguage()

  // Debounced search
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setLoading(true)
        try {
          const results = await searchProducts(searchTerm, 8)
          setProducts(results)
        } catch (error) {
          console.error("Search error:", error)
          setProducts([])
        } finally {
          setLoading(false)
        }
      } else {
        setProducts([])
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

  const formatDimension = (value: number) => {
    const converted = convertDimension(value, "cm")
    return converted.toFixed(1)
  }

  const handleSelect = (product: Product) => {
    router.push(`/product/${product.sku}`)
    setOpen(false)
    setSearchTerm("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && products.length > 0) {
      handleSelect(products[0])
    }
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder={t("home.search.placeholder")}
          value={searchTerm}
          onValueChange={setSearchTerm}
          onKeyDown={handleKeyDown}
          className="h-12"
        />
        {(searchTerm.length >= 2 || products.length > 0) && (
          <CommandList className="max-h-[300px]">
            {loading && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  {t("home.search.searching")}
                </div>
              </div>
            )}

            {!loading && products.length === 0 && searchTerm.length >= 2 && (
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 py-6">
                  <Package className="h-8 w-8 text-muted-foreground" />
                  <p>{t("home.search.noResults", { searchTerm })}</p>
                  <p className="text-xs text-muted-foreground">{t("home.search.tryDifferent")}</p>
                </div>
              </CommandEmpty>
            )}

            {!loading && products.length > 0 && (
              <CommandGroup heading="Products">
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={`${product.name} ${product.sku} ${product.brand}`}
                    onSelect={() => handleSelect(product)}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{product.brand}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">{product.sku}</span>
                        <span>•</span>
                        <span>
                          {formatDimension(product.primaryDimensions.length)} ×{" "}
                          {formatDimension(product.primaryDimensions.width)} ×{" "}
                          {formatDimension(product.primaryDimensions.height)} {unit}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  )
}
