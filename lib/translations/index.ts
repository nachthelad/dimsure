import { en } from "./en";
import { es } from "./es";

export const translations = { en, es } as const;

export type TranslationKey = keyof typeof translations.en;
export type NestedTranslationKey<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? `${string & K}.${NestedTranslationKey<T[K]>}` : string & K }[keyof T]
  : never;

export function getTranslation(locale: string, key: string): string {
  const keys = key.split(".");
  let value: any = translations[locale as keyof typeof translations] || translations.en;

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback to English
      value = translations.en;
      for (const fallbackKey of keys) {
        value = value?.[fallbackKey];
        if (value === undefined) return key;
      }
      break;
    }
  }

  return typeof value === "string" ? value : key;
}

export function interpolate(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}
