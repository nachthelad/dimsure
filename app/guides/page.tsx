import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { GuidesListClient } from "@/components/features/guides-list-client";

export const metadata: Metadata = {
  title: "Packaging & Logistics Guides | Dimsure",
  description:
    "Expert guides on product measurement, packaging optimization, shipping cost reduction, and logistics best practices. Learn from industry professionals.",
  keywords:
    "packaging guides, logistics optimization, product measurement, shipping cost reduction, e-commerce packaging, fulfillment best practices",
  openGraph: {
    title: "Packaging & Logistics Guides | Dimsure",
    description:
      "Expert guides on packaging optimization and logistics best practices",
    type: "website",
  },
};

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Packaging & Logistics Guides
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Expert guides and best practices for product measurement, packaging
          optimization, shipping cost reduction, and logistics excellence.
        </p>
      </div>

      {/* Firestore-backed guides list */}
      <GuidesListClient />

      {/* CTA Section */}
      <Card className="mt-12">
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">
            Ready to Optimize Your Operations?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start by getting accurate product dimensions for your inventory.
            Join thousands of businesses using Dimsure to optimize their
            packaging and logistics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Search Product Dimensions
            </Link>
            <Link
              href="/add-product"
              className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-md hover:bg-muted/50 transition-colors"
            >
              Contribute Data
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
