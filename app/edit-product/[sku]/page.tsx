"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

export default function EditProductPage() {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/my-contributions">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Contributions
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">Edit Product</h1>
        <p className="text-muted-foreground">Product editing functionality coming soon.</p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Feature Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We're working on bringing you the ability to edit your product submissions.
          </p>
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">What you'll be able to edit:</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Product name and description</li>
              <li>• Dimensions and measurements</li>
              <li>• Product images</li>
              <li>• Category and specifications</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            For now, you can continue adding new products to help grow the database.
          </p>
          <Link href="/add-product">
            <Button>
              <Package className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
