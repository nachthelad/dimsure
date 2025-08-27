import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRecentProducts, getDatabaseStats } from "@/lib/firestore";
import type { Product } from "@/lib/types";
import { HomePageClient } from "@/components/features/home-page-client";

// Helper function to serialize Firestore timestamps to plain objects
function serializeProduct(product: Product): Product {
  return {
    ...product,
    createdAt: product.createdAt?.toDate?.() || product.createdAt,
    lastModified: product.lastModified?.toDate?.() || product.lastModified,
  };
}

// Enable ISR with 300 seconds (5 minutes) revalidation
export const revalidate = 300;

interface DatabaseStats {
  totalProducts: number;
  totalContributions: number;
  averageConfidence: number;
}

interface HomePageProps {
  products: Product[];
  stats: DatabaseStats;
}

// Server Component with ISR
export default async function HomePage(): Promise<JSX.Element> {
  let products: Product[] = [];
  let stats: DatabaseStats = {
    totalProducts: 0,
    totalContributions: 0,
    averageConfidence: 0,
  };

  try {
    // Fetch data on the server with error handling
    const [recentProducts, databaseStats] = await Promise.all([
      getRecentProducts(8),
      getDatabaseStats(),
    ]);
    // Serialize Firestore timestamps to plain objects for client component
    products = recentProducts.map(serializeProduct);
    stats = databaseStats;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Fallback to empty data if fetch fails
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
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
      }
    >
      <HomePageClient products={products} stats={stats} />
    </Suspense>
  );
}
