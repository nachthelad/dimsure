import { siteConfig } from "@/lib/site-config";
import type { Product } from "@/lib/types";

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/android-chrome-512x512.png`,
  description: siteConfig.description,
  sameAs: [siteConfig.links.twitter],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "hello@dimsure.online",
    availableLanguage: ["English", "Spanish"],
  },
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const generateProductSchema = (product: Product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description:
    product.description || `${product.name} dimensions and specifications`,
  sku: product.sku,
  brand: {
    "@type": "Brand",
    name: product.brand || "Unknown",
  },
  category: product.category,
  image: product.mainImage ? [product.mainImage] : [],
  additionalProperty: [
    {
      "@type": "PropertyValue",
      name: "Length",
      value: `${product.primaryDimensions.length}mm`,
    },
    {
      "@type": "PropertyValue",
      name: "Width",
      value: `${product.primaryDimensions.width}mm`,
    },
    {
      "@type": "PropertyValue",
      name: "Height",
      value: `${product.primaryDimensions.height}mm`,
    },
    {
      "@type": "PropertyValue",
      name: "Data Confidence",
      value: `${product.confidence || 0}%`,
    },
  ],
  aggregateRating: product.confidence
    ? {
        "@type": "AggregateRating",
        ratingValue: (product.confidence / 100) * 5,
        bestRating: 5,
        worstRating: 1,
        ratingCount: Math.max(1, product.likes || 0),
      }
    : undefined,
});

export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});
