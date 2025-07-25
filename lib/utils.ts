import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique URL slug from SKU
 * Converts SKU to lowercase, replaces special chars with hyphens, adds timestamp
 */
export function generateUrlSlug(sku: string): string {
  const baseSlug = sku
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-") // Replace special chars with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  const timestamp = Date.now();
  return `${baseSlug}-${timestamp}`;
}

/**
 * Extract SKU from URL slug
 * Removes the timestamp suffix to get the original SKU pattern
 */
export function extractSkuFromSlug(slug: string): string {
  // Remove the timestamp suffix (last hyphen and numbers)
  return slug.replace(/-\d+$/, "");
}
