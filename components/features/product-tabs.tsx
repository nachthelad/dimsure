import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductComments } from "@/components/features/product-comments";

interface ProductTabsProps {
  product: any;
  createdByUser: any;
  lastModifiedByUser: any;
  t: (key: string) => string;
}

const TAB_KEYS = ["specifications", "comments", "history"];

export const ProductTabs: React.FC<ProductTabsProps> = ({
  product,
  createdByUser,
  lastModifiedByUser,
  t,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabTitles = [
    t("product.tabs.specifications"),
    t("product.tabs.comments"),
    t("product.tabs.history"),
  ];

  const renderTabContent = (tabIdx: number) => {
    switch (tabIdx) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t("product.specifications.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Peso */}
                <div>
                  <span className="font-medium text-muted-foreground">
                    {t("product.specifications.weight")}
                  </span>
                  <p className="text-foreground mt-1">
                    {product.specifications && product.specifications.weight
                      ? product.specifications.weight === "Not specified"
                        ? t("product.specifications.notSpecified")
                        : product.specifications.weight
                      : t("product.specifications.notSpecified")}
                  </p>
                </div>
                {/* Comentario del creador */}
                <div>
                  <span className="font-medium text-muted-foreground">
                    {t("product.specifications.comment")}
                  </span>
                  <p className="text-foreground mt-1">
                    {product.description ||
                      t("product.specifications.notSpecified")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 1:
        return <ProductComments productSku={product.sku} />;
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t("product.history.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-border">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-primary">
                        {lastModifiedByUser?.publicTag ||
                          lastModifiedByUser?.displayName ||
                          createdByUser?.publicTag ||
                          createdByUser?.displayName ||
                          "@unknown"}
                      </span>
                      {product.lastModified && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            product.lastModified.toDate()
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("product.history.updated")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-primary">
                        {createdByUser?.publicTag ||
                          createdByUser?.displayName ||
                          "@unknown"}
                      </span>
                      {product.createdAt && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            product.createdAt.toDate()
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("product.history.initialSubmission")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  // Responsive: mobile slider, desktop tabs
  return (
    <div className="mb-8">
      {/* Mobile: slider */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between mb-4">
          <button
            aria-label={t("product.tabs.previous")}
            onClick={() =>
              setActiveTab((prev) =>
                prev === 0 ? TAB_KEYS.length - 1 : prev - 1
              )
            }
            className="p-2 text-muted-foreground border rounded-lg transition-colors hover:bg-muted/70 disabled:opacity-50"
            disabled={TAB_KEYS.length <= 1}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span
            className="flex-1 text-center text-md font-semibold bg-muted rounded-lg px-1 py-2 border text-muted-foreground mx-2"
            style={{ letterSpacing: "0.01em" }}
          >
            {tabTitles[activeTab]}
          </span>
          <button
            aria-label={t("product.tabs.next")}
            onClick={() =>
              setActiveTab((prev) =>
                prev === TAB_KEYS.length - 1 ? 0 : prev + 1
              )
            }
            className="p-2 text-muted-foreground border rounded-lg transition-colors hover:bg-muted/70 disabled:opacity-50"
            disabled={TAB_KEYS.length <= 1}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        {renderTabContent(activeTab)}
      </div>
      {/* Desktop: tabs normales */}
      <div className="hidden md:block">
        <Tabs defaultValue={TAB_KEYS[0] || "specifications"}>
          <TabsList className="w-full grid grid-cols-3 border-b border-border mb-2">
            {TAB_KEYS.map((key, idx) => (
              <TabsTrigger key={key} value={key}>
                {tabTitles[idx]}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={TAB_KEYS[0] || "specifications"} className="mt-6">
            {renderTabContent(0)}
          </TabsContent>
          <TabsContent value={TAB_KEYS[1] || "comments"} className="mt-6">
            {renderTabContent(1)}
          </TabsContent>
          <TabsContent value={TAB_KEYS[2] || "history"} className="mt-6">
            {renderTabContent(2)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductTabs;
