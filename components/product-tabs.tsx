import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductTabsProps {
  product: any;
  createdByUser: any;
  lastModifiedByUser: any;
  t: (key: string) => string;
}

const TAB_KEYS = ["specifications", "alternatives", "comments", "history"];

export const ProductTabs: React.FC<ProductTabsProps> = ({ product, createdByUser, lastModifiedByUser, t }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Simple mobile detection (puedes mejorar esto si tienes un hook de breakpoint)
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const tabTitles = [
    t("product.tabs.specifications"),
    t("product.tabs.alternatives"),
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium text-muted-foreground">
                        {key === "weight" ? t("product.specifications.weight") : `${key}:`}
                      </span>
                      <span className="text-foreground whitespace-nowrap truncate max-w-[120px] md:max-w-[180px]">
                        {value === "Not specified" ? t("product.specifications.notSpecified") : (value as string)}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("product.alternatives.noAlternatives")}</h3>
              <p className="text-muted-foreground">{t("product.alternatives.noAlternativesMessage")}</p>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{t("product.comments.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t("product.comments.noComments")}</h3>
                <p className="text-muted-foreground">{t("product.comments.noCommentsMessage")}</p>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
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
                          {new Date(product.lastModified.toDate()).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{t("product.history.updated")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-primary">
                        {createdByUser?.publicTag || createdByUser?.displayName || "@unknown"}
                      </span>
                      {product.createdAt && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(product.createdAt.toDate()).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{t("product.history.initialSubmission")}</p>
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
            onClick={() => setActiveTab((prev) => (prev === 0 ? TAB_KEYS.length - 1 : prev - 1))}
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
            onClick={() => setActiveTab((prev) => (prev === TAB_KEYS.length - 1 ? 0 : prev + 1))}
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
        <Tabs defaultValue={TAB_KEYS[0]}>
          <TabsList className="w-full grid grid-cols-4 border-b border-border mb-2">
            {TAB_KEYS.map((key, idx) => (
              <TabsTrigger key={key} value={key}>{tabTitles[idx]}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={TAB_KEYS[0]} className="mt-6">{renderTabContent(0)}</TabsContent>
          <TabsContent value={TAB_KEYS[1]} className="mt-6">{renderTabContent(1)}</TabsContent>
          <TabsContent value={TAB_KEYS[2]} className="mt-6">{renderTabContent(2)}</TabsContent>
          <TabsContent value={TAB_KEYS[3]} className="mt-6">{renderTabContent(3)}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductTabs; 