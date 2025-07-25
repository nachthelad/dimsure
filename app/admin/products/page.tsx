"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAllProductsAdmin, updateProductField } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/layout/language-provider";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProductsPage() {
  const { user, isLoggedIn, loading, userData } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [modalImage, setModalImage] = useState<string | null>(null);
  const router = useRouter();

  // Solo permitir acceso a admins
  const isAdmin = userData?.role === "admin";

  useEffect(() => {
    if (!loading && (!isLoggedIn || !isAdmin)) {
      router.replace("/not-found");
    } else if (!loading && isLoggedIn && isAdmin) {
      getAllProductsAdmin()
        .then(setProducts)
        .finally(() => setIsLoading(false));
    }
  }, [isLoggedIn, loading, isAdmin, router]);

  const handleStatusChange = async (
    urlSlug: string,
    newStatus: "approved" | "pending" | "rejected"
  ) => {
    try {
      // Use the provided slug directly (it should be safe now)
      const safeSlug = urlSlug;

      await updateProductField(
        safeSlug,
        "status",
        newStatus,
        user?.uid || "admin"
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.urlSlug === urlSlug || p.sku === urlSlug
            ? { ...p, status: newStatus }
            : p
        )
      );
      toast({
        title: `Producto ${
          newStatus === "approved" ? "aprobado" : "rechazado"
        }`,
      });
    } catch (err) {
      toast({ title: "Error al cambiar estado", variant: "destructive" });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-2" />
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-4 w-40 mb-1" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Filtro visual de estado
  const statusOptions = [
    { value: "pending", label: t("admin.products.status.pending") },
    { value: "approved", label: t("admin.products.status.approved") },
    { value: "rejected", label: t("admin.products.status.rejected") },
  ];

  const filteredProducts = products.filter(
    (p) => (p.status || "pending") === statusFilter
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("admin.products.title")}</h1>
      <div className="mb-6 flex gap-4 items-center">
        <span className="font-medium">
          {t("admin.products.filterByStatus")}
        </span>
        {statusOptions.map((opt) => (
          <Button
            key={opt.value}
            variant={statusFilter === opt.value ? "default" : "secondary"}
            onClick={() => setStatusFilter(opt.value as any)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.sku}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {product.name}
                <Badge
                  variant={
                    product.status === "approved"
                      ? "default"
                      : product.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {t(`admin.products.status.${product.status || "pending"}`)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Galería de miniaturas de todas las imágenes */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {product.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img || "/placeholder.svg"}
                      alt={t("admin.products.imageAlt", {
                        name: product.name,
                        idx: idx + 1,
                      })}
                      className="w-20 h-20 object-cover rounded border cursor-pointer hover:ring-2 hover:ring-primary"
                      onClick={() => setModalImage(img)}
                    />
                  ))}
                </div>
              )}
              {/* Modal para mostrar imagen grande */}
              {modalImage && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                  onClick={() => setModalImage(null)}
                >
                  <div
                    className="bg-background rounded-lg p-4 max-w-2xl max-h-[90vh] flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={modalImage}
                      alt={t("admin.products.modalImageAlt")}
                      className="max-w-full max-h-[80vh] rounded"
                    />
                    <Button
                      className="mt-4"
                      onClick={() => setModalImage(null)}
                    >
                      {t("common.close")}
                    </Button>
                  </div>
                </div>
              )}
              <div className="mb-2 text-sm text-muted-foreground">
                {t("admin.products.sku")}: {product.sku}
              </div>
              <div className="mb-2 text-sm">
                {t("admin.products.brand")}: {product.brand}
              </div>
              <div className="mb-2 text-sm">
                {t("admin.products.category")}: {product.category}
              </div>
              <div className="mb-2 text-sm">
                {t("admin.products.dimensions")}:{" "}
                {product.primaryDimensions?.length} x{" "}
                {product.primaryDimensions?.width} x{" "}
                {product.primaryDimensions?.height} mm
              </div>
              {/* Mostrar detalle de moderación si existe y el producto está pendiente */}
              {product.status === "pending" &&
                product.moderationResults &&
                product.moderationResults.length > 0 && (
                  <>
                    <div className="mb-2 text-xs bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded text-yellow-900 whitespace-pre-wrap overflow-x-auto">
                      <strong>{t("admin.products.moderationDetail")}:</strong>
                      <ul className="list-disc ml-4 mt-1">
                        {product.moderationResults.map(
                          (res: any, idx: number) => (
                            <li key={idx}>
                              <span className="font-medium">{res.name}:</span>{" "}
                              {res.summary ||
                                res.error ||
                                JSON.stringify(res.result, null, 2)}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </>
                )}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() =>
                    handleStatusChange(
                      product.urlSlug || product.id || product.sku,
                      "approved"
                    )
                  }
                  disabled={product.status === "approved"}
                >
                  {t("admin.products.approve")}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    handleStatusChange(
                      product.urlSlug || product.id || product.sku,
                      "rejected"
                    )
                  }
                  disabled={product.status === "rejected"}
                >
                  {t("admin.products.reject")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
