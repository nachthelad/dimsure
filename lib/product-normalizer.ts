import type { Product } from "./types"

// Database of known brands and their correct capitalization
const BRAND_NORMALIZATIONS: Record<string, string> = {
  // Apple products
  iphone: "iPhone",
  ipad: "iPad",
  macbook: "MacBook",
  imac: "iMac",
  airpods: "AirPods",
  apple: "Apple",

  // Samsung
  samsung: "Samsung",
  galaxy: "Galaxy",

  // Google
  google: "Google",
  pixel: "Pixel",

  // Microsoft
  microsoft: "Microsoft",
  xbox: "Xbox",
  surface: "Surface",

  // Sony
  sony: "Sony",
  playstation: "PlayStation",
  ps5: "PS5",
  ps4: "PS4",

  // Nintendo
  nintendo: "Nintendo",
  switch: "Switch",
  oled: "OLED",

  // Other brands
  hp: "HP",
  dell: "Dell",
  lenovo: "Lenovo",
  asus: "ASUS",
  lg: "LG",
  huawei: "Huawei",
  xiaomi: "Xiaomi",
  oneplus: "OnePlus",
}

// Function to capitalize a single word with special cases
function capitalizeWord(word: string): string {
  const lowerWord = word.toLowerCase()

  // Check if this word has a special capitalization
  if (BRAND_NORMALIZATIONS[lowerWord]) {
    return BRAND_NORMALIZATIONS[lowerWord]
  }

  // Default title case
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

// Product normalizer with special capitalization rules
export function normalizeProductName(name: string): string {
  const trimmed = name.trim()

  // Clean up extra spaces and apply smart capitalization
  const normalized = trimmed
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .split(" ") // Split into words
    .map((word) => capitalizeWord(word)) // Apply smart capitalization to each word
    .join(" ") // Join back together

  return normalized
}

export function normalizeBrandName(brand: string): string {
  const trimmed = brand.trim()

  // Apply smart capitalization to brand names too
  return trimmed
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => capitalizeWord(word))
    .join(" ")
}

// Keep this for potential future use, but don't auto-apply
export function extractBrandFromName(name: string): string {
  // If no brand found, return the first word capitalized
  const firstWord = name.split(" ")[0]
  return capitalizeWord(firstWord)
}

// Simplified validation - just basic checks
export function validateProductName(name: string): { isValid: boolean; suggestion?: string; errors: string[] } {
  const errors: string[] = []

  if (name.length < 3) {
    errors.push("Product name must be at least 3 characters long")
  }

  if (name.length > 100) {
    errors.push("Product name must be less than 100 characters")
  }

  // Suggest if there are multiple spaces or if capitalization could be improved
  let suggestion: string | undefined
  const cleaned = name.replace(/\s+/g, " ").trim()
  const smartCapitalized = cleaned
    .split(" ")
    .map((word) => capitalizeWord(word))
    .join(" ")

  if (cleaned !== name || smartCapitalized !== cleaned) {
    suggestion = smartCapitalized
  }

  return {
    isValid: errors.length === 0,
    suggestion: suggestion !== name ? suggestion : undefined,
    errors,
  }
}

export function normalizeProduct(doc: any): Product {
  const data = doc.data ? doc.data() : doc
  return {
    id: doc.id,
    name: data.name ?? "",
    sku: data.sku ?? "",
    brand: data.brand ?? "",
    category: data.category ?? "",
    primaryDimensions: data.primaryDimensions ?? { length: 0, width: 0, height: 0 },
    likes: data.likes ?? 0,
    confidence: data.confidence ?? 0,
    mainImage: data.mainImage ?? "",
    likedBy: data.likedBy ?? [],
    images: data.images ?? [],
    views: data.views ?? 0,
    description: data.description ?? "",
    createdBy: data.createdBy ?? "",
    lastModifiedBy: data.lastModifiedBy ?? "",
    lastModified: data.lastModified ?? data.createdAt ?? new Date(),
    createdAt: data.createdAt ?? new Date(),
    specifications: data.specifications ?? {},
  }
}
