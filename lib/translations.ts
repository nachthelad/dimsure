import type { Locale } from "./i18n"

// Import translation files
import enTranslations from "@/public/locales/en/common.json"
import esTranslations from "@/public/locales/es/common.json"

export const translations = {
  en: enTranslations,
  es: esTranslations,
} as const

export type TranslationKey = keyof typeof translations.en
export type NestedTranslationKey<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? `${string & K}.${NestedTranslationKey<T[K]>}` : string & K }[keyof T]
  : never

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split(".")
  let translation: any = translations[locale]

  for (const k of keys) {
    if (translation && typeof translation === "object" && k in translation) {
      translation = translation[k]
    } else {
      // Fallback to English if translation not found
      translation = translations.en
      for (const fallbackKey of keys) {
        if (translation && typeof translation === "object" && fallbackKey in translation) {
          translation = translation[fallbackKey]
        } else {
          return key // Return the key if no translation found
        }
      }
      break
    }
  }

  return typeof translation === "string" ? translation : key
}

export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key]?.toString() || match
  })
}
