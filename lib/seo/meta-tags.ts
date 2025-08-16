import { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

export function generateSEOMetadata({
  title,
  description,
  keywords,
  image = siteConfig.ogImage,
  url = siteConfig.url,
  type = "website",
  publishedTime,
  authors,
  noIndex = false,
}: SEOProps): Metadata {
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords || siteConfig.keywords.join(", "),
    authors: authors
      ? authors.map((name) => ({ name }))
      : [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: fullTitle,
      description,
      type,
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime &&
        type === "article" && {
          publishedTime,
          authors,
        }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@dimsure_app",
    },
  };
}

export function generateProductSEO(product: {
  name: string;
  sku: string;
  brand?: string;
  category?: string;
  description?: string;
  mainImage?: string;
  urlSlug: string;
}) {
  const title = `${product.name} Dimensions | ${product.brand || "Product"} ${
    product.sku
  }`;
  const description =
    product.description ||
    `Find accurate dimensions for ${product.name} (${product.sku}). Get precise measurements for packaging optimization and shipping calculations.`;

  const keywords = [
    product.name.toLowerCase(),
    product.sku.toLowerCase(),
    product.brand?.toLowerCase(),
    product.category?.toLowerCase(),
    "dimensions",
    "measurements",
    "packaging",
    "shipping",
    "box size",
  ]
    .filter(Boolean)
    .join(", ");

  return generateSEOMetadata({
    title,
    description,
    keywords,
    image: product.mainImage || siteConfig.ogImage,
    url: `${siteConfig.url}/product/${product.urlSlug}`,
    type: "article",
  });
}
