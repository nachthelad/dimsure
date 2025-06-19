"use client"

import { useEffect, useState } from "react"
import {
  Package,
  TrendingUp,
  Loader2,
  Plus,
  Search,
  Edit,
  Eye,
  Heart,
  Wrench,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { getUserProducts, fixOrphanProducts } from "@/lib/firestore"
import { useUnit } from "@/components/unit-provider"
import { APP_CONSTANTS } from "@/lib/constants"

interface UserProduct {
  id: string
  name: string
  sku: string
  brand: string
  category: string
  primaryDimensions: { length: number; width: number; height: number }
  likes: number
  views: number
  confidence: number
  mainImage: string
  createdAt: any
  lastModified: any
}

export default function DebugPage() {
  const { isLoggedIn, userData, loading, user } = useAuth()
  const { unit, convertDimension } = useUnit()
  const [products, setProducts] = useState<UserProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<UserProduct[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isFixingOrphans, setIsFixingOrphans] = useState(false)

  // Check if user is authorized (only nacho.vent@gmail.com)
  const isAuthorized = user?.email === APP_CONSTANTS.DEBUG_AUTHORIZED_EMAIL

  const fetchUserProducts = async () => {
    if (user) {
      try {
        setIsLoadingProducts(true)
        const userProducts = await getUserProducts(user.uid)
        console.log("Fetched user products:", userProducts.length)
        setProducts(userProducts)
        setFilteredProducts(userProducts)
      } catch (error) {
        console.error("Error fetching user products:", error)
      } finally {
        setIsLoadingProducts(false)
      }
    }
  }

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchUserProducts()
    }
  }, [user, isLoggedIn])

  // Filter products based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, products])

  const handleFixOrphans = async () => {
    if (!user) return

    setIsFixingOrphans(true)
    try {
      const fixedCount = await fixOrphanProducts(user.uid)
      if (fixedCount > 0) {
        alert(`Fixed ${fixedCount} products! Refreshing your contributions...`)
        await fetchUserProducts()
      } else {
        alert("No orphan products found to fix.")
      }
    } catch (error) {
      console.error("Error fixing orphans:", error)
      alert("Error fixing orphan products. Please try again.")
    } finally {
      setIsFixingOrphans(false)
    }
  }

  const formatDimension = (value: number) => {
    const converted = convertDimension(value, "mm")
    return Math.round(converted).toString()
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown"
    try {
      return new Date(timestamp.toDate()).toLocaleDateString()
    } catch {
      return "Unknown"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">You need to be signed in to access this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unauthorized Access</h3>
            <p className="text-muted-foreground mb-4">This debug page is restricted to authorized users only.</p>
            <p className="text-sm text-muted-foreground">Current user: {user?.email}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">🐛 Debug Dashboard</h1>
            <p className="text-xl text-muted-foreground">Internal debugging tools and information</p>
          </div>
          <div className="flex gap-2">
            <Link href="/add-product">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add New Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Debug Info */}
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>
                <strong>User ID:</strong> {user?.uid}
              </p>
              <p>
                <strong>User Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Display Name:</strong> {user?.displayName || "Not set"}
              </p>
              <p>
                <strong>Public Tag:</strong> {userData?.publicTag || "Not set"}
              </p>
              <p>
                <strong>Products Found:</strong> {products.length}
              </p>
              <p>
                <strong>Is Logged In:</strong> {isLoggedIn ? "Yes" : "No"}
              </p>
              <p>
                <strong>Loading:</strong> {loading ? "Yes" : "No"}
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={fetchUserProducts} disabled={isLoadingProducts}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh Products
                </Button>
                <Button size="sm" variant="outline" onClick={handleFixOrphans} disabled={isFixingOrphans}>
                  <Wrench className="h-4 w-4 mr-1" />
                  {isFixingOrphans ? "Fixing..." : "Fix Orphan Products"}
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* No products found - show fix option */}
        {!isLoadingProducts && products.length === 0 && (
          <Alert className="mb-6">
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">No contributions found</p>
                  <p className="text-sm text-muted-foreground">
                    If you've added products before, they might not be linked to your account.
                  </p>
                </div>
                <Button onClick={handleFixOrphans} disabled={isFixingOrphans}>
                  <Wrench className="h-4 w-4 mr-2" />
                  {isFixingOrphans ? "Fixing..." : "Fix My Products"}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Products submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.reduce((total, product) => total + (product.likes || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Community appreciation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.reduce((total, product) => total + (product.views || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">Product page visits</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search Bar */}
      {products.length > 0 && (
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          )}
        </div>
      )}

      {/* Products List */}
      {isLoadingProducts ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Image
                    src={product.mainImage || "/placeholder.svg"}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{product.brand}</Badge>
                          <Badge variant="secondary">{product.category}</Badge>
                          <span className="text-sm font-mono text-primary">{product.sku}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/edit-product/${product.sku}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/product/${product.sku}`}>
                          <Button variant="default" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>
                          {formatDimension(product.primaryDimensions.length)} ×{" "}
                          {formatDimension(product.primaryDimensions.width)} ×{" "}
                          {formatDimension(product.primaryDimensions.height)} {unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        <span>{product.likes || 0} likes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{product.views || 0} views</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>{product.confidence}% confidence</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created: {formatDate(product.createdAt)}</span>
                      {product.lastModified && product.lastModified !== product.createdAt && (
                        <span>Last modified: {formatDate(product.lastModified)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
            <p className="text-muted-foreground mb-4">You haven't submitted any products to the database yet.</p>
            <Link href="/add-product">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-4">
              No products match your search for "{searchTerm}". Try a different search term.
            </p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
