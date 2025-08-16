// SEO Performance Tracking

export const trackSEOEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, {
      event_category: "SEO",
      ...parameters,
    });
  }
};

// Track important SEO events
export const seoEvents = {
  // Content engagement
  guideViewed: (guideTitle: string) =>
    trackSEOEvent("guide_viewed", { guide_title: guideTitle }),

  faqSearched: (searchTerm: string) =>
    trackSEOEvent("faq_searched", { search_term: searchTerm }),

  productViewed: (productName: string, sku: string) =>
    trackSEOEvent("product_viewed", { product_name: productName, sku }),

  // User actions that indicate content quality
  timeOnPage: (pageType: string, timeSpent: number) =>
    trackSEOEvent("time_on_page", {
      page_type: pageType,
      time_spent: timeSpent,
    }),

  scrollDepth: (pageType: string, depth: number) =>
    trackSEOEvent("scroll_depth", { page_type: pageType, depth }),

  // Conversion events
  productSearched: (searchTerm: string) =>
    trackSEOEvent("product_searched", { search_term: searchTerm }),

  productContributed: (category: string) =>
    trackSEOEvent("product_contributed", { category }),
};
